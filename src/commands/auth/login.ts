import { catchAndLogError } from "@/src/lib/utils";
import { app } from "@/src/server";
import { Command } from "commander";
import open from "open";
import { v4 as uuidv4 } from "uuid";
import pkceChallenge from "pkce-challenge";
import type { Request } from "express";
import { EventEmitter } from "node:events";
import { request } from "@/src/lib/api";
import type z from "zod";
import type { githubCallbackSchema } from "@/src/validation/auth";
import { saveCredentials } from "@/src/misc/credentials";
import { parse } from "cookie";
import {  log, outro } from "@clack/prompts";

export const loginAction = async () => {
  log.step("Logging in...");

  const pkce = await pkceChallenge();
  const state = uuidv4();

  await catchAndLogError(async () => {
    const port = 38363;
    const emitter = new EventEmitter();

    const authComplete = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Authentication timed out")),
        5 * 60 * 1000,
      );

      emitter.once("terminate", () => {
        clearTimeout(timeout);
        resolve();
      });

      emitter.once("error", (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    app.get(
      "/callback",
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          { code: string; state?: string }
        >,
        res,
      ) => {
        await catchAndLogError(async () => {
          if (req.query.state !== state) {
            emitter.emit("error", new Error("Invalid state parameter"));
            return res.status(400).send("Invalid state");
          }

          const result = await request<
            z.infer<typeof githubCallbackSchema>,
            | { status: "error"; message: string }
            | {
                status: "success";
                data: {
                  access_token: string;
                  username: string;
                  role: string;
                  refresh_token: string;
                };
              }
          >({
            url: "/auth/github/callback",
            method: "GET",
            params: {
              code: req.query.code,
              code_verifier: pkce.code_verifier,
            },
          });
          if (result.data.status === "success") {
            const cookies = result.headers["set-cookie"] ?? [];
            const parsed = Object.fromEntries(
              cookies
                .map((c) => Object.entries(parse(c))[0])
                .filter(
                  (entry): entry is [string, string] => entry !== undefined,
                ),
            );

            saveCredentials({
              ...result.data.data,
              refresh_token: parsed.refreshToken!,
            });
            res
              .status(200)
              .send(
                "Authentication successful. You can close this page and return back to Insighta Labs+ now.",
              );
            emitter.emit("terminate");
            return;
          }

          emitter.emit("error", new Error("Failed to authenticate user"));
          return res.status(500).send("Failed to authenticate user");
        });
      },
    );

    const server = app.listen(port, () => {
      log.info("Server started at port: " + port);
      log.info("Opening browser");
      open(
        `https://github.com/login/oauth/authorize?client_id=Ov23liXhC3Msu8ermI7j&redirect_uri=http://127.0.0.1:${port}/callback&state=${state}&code_challenge=${pkce.code_challenge}&code_challenge_method=${pkce.code_challenge_method}&scope=read:user,user:email`,
      );
      log.info("Browser open. Waiting for your authorization in the browser");
    });

    try {
      await authComplete;
      outro("Login successful. You can close the browser tab now");
    } finally {
      server.close();
    }
  });
};

export const loginCommand = new Command("login")
  .description("Login to your Insighta Labs+ account")
  .action(loginAction);
