import { request } from "@/src/lib/api";
import { catchAndLogError, parseOrThrow, renderTable } from "@/src/lib/utils";
import { ProfileIdSchema } from "@/src/validation/profile";
import { Command } from "commander";
import ora from "ora";
import _ from "lodash";
import { intro, log } from "@clack/prompts";

export const getProfileCommand = new Command("get")
  .description("Get profile by ID")
  .argument("<id>", "ID of the profile")
  .action(async (id: string) => {
    intro("Insighta")
    await catchAndLogError(async () => {
      log.step("Pulling info...Please wait...");
      const data = parseOrThrow(ProfileIdSchema, id);
      const getProfileRequest = await request({
        method: "get",
        url: "/api" + "/profiles/" + data,
      });
      if (getProfileRequest?.data.status === "success") {
        renderTable([getProfileRequest.data.data]);
      }
    });
  });
