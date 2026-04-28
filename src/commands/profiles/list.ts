import { request } from "@/src/lib/api";
import {
  buildOptions,
  catchAndLogError,
  normalizeOptions,
  parseOrThrow,
  renderTable,
} from "@/src/lib/utils";
import { profileQuerySchema } from "@/src/validation/profile";
import { Command } from "commander";
import * as z from "zod";
import type { ErrorResponse, SuccessResponse } from "@/src/misc/types";
import { intro, log } from "@clack/prompts";

export const listProfilesCommand = buildOptions(
  new Command("list").description("List out profiles"),
  profileQuerySchema,
).action(async (options: z.infer<typeof profileQuerySchema>) => {
  intro("Insighta");
  await catchAndLogError(async () => {
    log.step("Pulling info...Please wait...");
    const data = parseOrThrow(profileQuerySchema, normalizeOptions(options));
    const listProfilesRequest = await request<
      z.infer<typeof profileQuerySchema>,
      | ({ data: Pick<SuccessResponse, "data">[] } & Omit<
          SuccessResponse,
          "data"
        >)
      | ErrorResponse
    >({
      method: "get",
      url: "/api" + "/profiles",
      params: { ...data },
    });
    if (listProfilesRequest?.data.status === "success") {
      renderTable(listProfilesRequest.data.data);
    }
  });
});
