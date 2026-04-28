import { request } from "@/src/lib/api";
import { catchAndLogError, parseOrThrow, renderTable } from "@/src/lib/utils";
import { profileSearchSchema } from "@/src/validation/profile";
import { Command } from "commander";
import type { ErrorResponse, SuccessResponse } from "@/src/misc/types";
import { intro, log } from "@clack/prompts";

export const searchProfilesCommand = new Command("search")
  .description("Search for profiles")
  .argument("<query>", "Search query")
  .action(async (searchTerm: string) => {
    intro("Insighta");
    await catchAndLogError(async () => {
      log.step("Searching...Please wait");
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
    });
  });
