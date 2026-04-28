import { catchAndLogError } from "@/src/lib/utils";
import { app } from "@/src/server";
import { Command } from "commander";
import ora from "ora";
import open from "open";
import { v4 as uuidv4 } from "uuid";
import pkceChallenge from "pkce-challenge";
import type { Request } from "express";
import { EventEmitter } from "node:events";
import { request } from "@/src/lib/api";
import type z from "zod";
import type { githubCallbackSchema } from "@/src/validation/auth";
import { loadCredentials, saveCredentials } from "@/src/misc/credentials";

export const loginCommand = new Command("login")
  .description("Login to your Insighta Labs+ account")
  .action(async () => {
    const spinner = ora({ spinner: "dots3" });
    spinner.start("Logging in...");

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

            // const result = (await axios.post(
            //   "https://github.com/login/oauth/access_token",
            //   {
            //     client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
            //     client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            //     code: req.query.code,
            //     redirect_uri: `http://127.0.0.1:${port}/callback`,
            //     code_verifier: pkce.code_verifier,
            //   },
            //   {
            //     headers: { Accept: "application/json" },
            //   },
            // )) as AxiosResponse<{
            //   access_token?: string;
            //   token_type?: "bearer";
            //   scope?: string;
            // }>;

            const result = await request<
              z.infer<typeof githubCallbackSchema>,
              | { status: "error"; message: string }
              | {
                  status: "success";
                  data: { accessToken: string; username: string; role: string };
                }
            >({
              url: "/auth/github/callback",
              method: "POST",
              data: {
                code: req.query.code,
                codeVerifier: pkce.code_verifier,
              },
            });
            if (result.data.status === "success") {
              saveCredentials(result.data.data);
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
          }, spinner);
        },
      );

      const server = app.listen(port, () => {
        spinner.info("Server started at port: " + port);
      });

      open(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=http://127.0.0.1:${port}/callback&state=${state}&code_challenge=${pkce.code_challenge}&code_challenge_method=${pkce.code_challenge_method}&scope=read:user,user:email`,
      );

      try {
        await authComplete;
        spinner.succeed("Login successful");
      } finally {
        server.close();
      }
    }, spinner);
  });
