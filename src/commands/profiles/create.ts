import { request } from "@/src/lib/api";
import { buildOptions, catchAndLogError, parseOrThrow } from "@/src/lib/utils";
import { createProfileSchema } from "@/src/validation/profile";
import { Command } from "commander";
import ora from "ora";
import * as z from "zod";

export const createProfileCommand = buildOptions(
  new Command("create").description("Create a new profile"),
  createProfileSchema,
).action(async (options: z.infer<typeof createProfileSchema>) => {
  const spinner = ora({
    spinner: "dots3",
  });

  await catchAndLogError(async () => {
    spinner.start("Creating profile");
    const data = parseOrThrow(createProfileSchema, options);
    const createProfileRequest = await request<
      z.infer<typeof createProfileSchema>
    >({
      method: "post",
      url: "/profiles",
      data: data,
    });
    if (createProfileRequest?.data.status === "success")
      spinner.succeed(
        createProfileRequest.data.message ?? "Profile created successfully",
      );
  }, spinner);
});
