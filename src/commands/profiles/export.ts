import {
  buildOptions,
  catchAndLogError,
  normalizeOptions,
  parseOrThrow,
} from "@/src/lib/utils";
import { ProfileExportSchema } from "@/src/validation/profile";
import { Command } from "commander";
import ora from "ora";
import * as z from "zod";
import _ from "lodash";

export const exportProfilesCommand = buildOptions(
  new Command("export").description(
    "Export profiles in a particular data format (e.g. CSV)",
  ),
  ProfileExportSchema,
).action(async (options: z.infer<typeof ProfileExportSchema>) => {
  const spinner = ora({
    spinner: "dots3",
  });
  await catchAndLogError(async () => {
    spinner.start("Generating export...Please wait...");
    const data = parseOrThrow(ProfileExportSchema, normalizeOptions(options));
    // const exportProfilesRequest = await request<
    //   z.infer<typeof ProfileExportSchema>,
    //   | ({ data: Pick<SuccessResponse, "data">[] } & Omit<
    //       SuccessResponse,
    //       "data"
    //     >)
    //   | ErrorResponse
    // >({
    //   method: "get",
    //   url: "/profiles",
    //   params: { ...data },
    // });
    // if (searchProfilesRequest?.data.status === "success") {
    //   renderTable(searchProfilesRequest.data.data);
    // }
  }, spinner);
});
