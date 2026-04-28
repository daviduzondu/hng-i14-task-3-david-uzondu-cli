import { request } from "@/src/lib/api";
import { catchAndLogError, parseOrThrow, renderTable } from "@/src/lib/utils";
import { profileSearchSchema } from "@/src/validation/profile";
import { Command } from "commander";
import ora from "ora";
import type { ErrorResponse, SuccessResponse } from "@/src/misc/types";

export const searchProfilesCommand = new Command("search")
  .description("Search for profiles")
  .argument("<query>", "Search query")
  .action(async (searchTerm: string) => {
    const spinner = ora({
      spinner: "dots3",
    });
    await catchAndLogError(async () => {
      spinner.start("Searching...Please wait");
      const q = parseOrThrow(profileSearchSchema, searchTerm);
      const searchProfilesRequest = await request<
        object,
        | ({ data: Pick<SuccessResponse, "data">[] } & Omit<
            SuccessResponse,
            "data"
          >)
        | ErrorResponse
      >({
        method: "get",
        url: "/api" + "/profiles/search",
        params: {
          q,
        },
      });
      if (searchProfilesRequest?.data.status === "success") {
        renderTable(searchProfilesRequest.data.data);
      }
    }, spinner);
  });
