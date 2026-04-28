import { request } from "@/src/lib/api";
import { buildOptions, catchAndLogError, parseOrThrow } from "@/src/lib/utils";
import { createProfileSchema } from "@/src/validation/profile";
import { intro, log } from "@clack/prompts";
import { Command } from "commander";
import ora from "ora";
import * as z from "zod";

export const createProfileCommand = buildOptions(
  new Command("create").description("Create a new profile"),
  createProfileSchema,
).action(async (options: z.infer<typeof createProfileSchema>) => {
  intro("Insighta");
  await catchAndLogError(async () => {
    log.step("Creating profile");
    const data = parseOrThrow(createProfileSchema, options);
    const createProfileRequest = await request<
      z.infer<typeof createProfileSchema>
    >({
      method: "post",
      url: "/api" + "/profiles",
      data: data,
    });
    if (createProfileRequest?.data.status === "success")
      log.success(
        createProfileRequest.data.message ?? "Profile created successfully",
      );
  });
});
