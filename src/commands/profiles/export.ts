import {
  buildOptions,
  catchAndLogError,
  normalizeOptions,
  parseOrThrow,
} from "@/src/lib/utils";
import { exportProfilesSchema } from "@/src/validation/profile";
import { Command } from "commander";
import * as z from "zod";
import { log } from "@clack/prompts";
import { request } from "@/src/lib/api";
import { writeFileSync } from "node:fs";
import path from "node:path";
import contentDisposition from "content-disposition";
import open from "open";

export const exportProfilesCommand = buildOptions(
  new Command("export").description(
    "Export profiles in a particular data format (e.g. CSV)",
  ),
  exportProfilesSchema,
).action(async (options: z.infer<typeof exportProfilesSchema>) => {
  await catchAndLogError(async () => {
    log.step("Generating export...Please wait...");
    const data = parseOrThrow(exportProfilesSchema, normalizeOptions(options));
    const exportProfilesRequest = await request<
      z.infer<typeof exportProfilesSchema>
    >({
      url: "/api/profiles/export",
      params: { ...data },
    });

    const disposition = contentDisposition.parse(
      exportProfilesRequest.headers["content-disposition"],
    );
    const filename = disposition.parameters['filename'];
    if (filename) {
      writeFileSync(
        path.join(process.cwd(), filename),
        exportProfilesRequest.data as unknown as string,
      );
      open(filename)
      log.success("Profile exported successfully.");
    } else {
      throw new Error("Failed to write file");
    }
  });
});
