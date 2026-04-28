import { request } from "@/src/lib/api";
import { catchAndLogError, parseOrThrow, renderTable } from "@/src/lib/utils";
import { ProfileIdSchema } from "@/src/validation/profile";
import { Command } from "commander";
import ora from "ora";
import _ from "lodash";

export const getProfileCommand = new Command("get")
  .description("Get profile by ID")
  .argument("<id>", "ID of the profile")
  .action(async (id: string) => {
    const spinner = ora({
      spinner: "dots3",
    });
    await catchAndLogError(async () => {
      spinner.start("Pulling info...Please wait...");
      const data = parseOrThrow(ProfileIdSchema, id);
      const getProfileRequest = await request({
        method: "get",
        url: "/api" + "/profiles/" + data,
      });
      if (getProfileRequest?.data.status === "success") {
        renderTable([getProfileRequest.data.data]);
      }
    }, spinner);
  });
