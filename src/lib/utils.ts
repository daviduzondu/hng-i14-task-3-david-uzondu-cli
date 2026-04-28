import { isAxiosError } from "axios";
import type { Command } from "commander";
import type { Ora } from "ora";
import z from "zod";
import Table from "cli-table3";
import _ from "lodash";
import { app } from "@/src/server";
import ora from "ora";

type RenderTableOptions = {
  head?: string[]; // override column headers
  truncate?: number; // truncate long cell values
};

export function normalizeOptions(options: object) {
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [_.snakeCase(key), value]),
  );
}

export function isOptional(schema: z.ZodType) {
  return schema.safeParse(undefined).success;
}

export function parseOrThrow<T>(
  schema: z.ZodType<T>,
  payload: object | string,
) {
  const { error, data } = z.safeParse(schema, payload);
  if (error)
    throw new Error(
      error?.issues[0]?.message ?? "Failed to validate options or arguments",
    );
  return data;
}

export function buildOptions(command: Command, schema: z.ZodObject) {
  let updatedCommand = command;
  const shape: [key: string, value: z.ZodType][] = Object.entries(schema.shape);
  for (const [key, value] of shape) {
    // console.log(value?.meta()?.description)
    updatedCommand = updatedCommand[
      isOptional(value) ? "option" : "requiredOption"
    ](
      `--${key.replaceAll("_", "-")} <value>`,
      (!isOptional(value) ? "\trequired" : "\t") +
        "\t" +
        (value?.description?.toLowerCase() ?? ""),
    );
  }
  return updatedCommand;
}

export async function catchAndLogError<T>(fn: () => Promise<T>, spinner: Ora) {
  try {
    await fn();
    spinner.stop();
  } catch (error: unknown) {
    console.error(error);
    spinner.fail(
      isAxiosError(error)
        ? error.response?.data?.message
          ? error.response?.data?.message
          : error.message
            ? error.message
            : "Something went wrong!"
        : error instanceof Error
          ? error.message
          : "Something went wrong!",
    );
  }
}

export function renderTable<T extends Record<string, unknown>>(
  data: T[],
  options: RenderTableOptions = {},
): void {
  if (!data.length) {
    console.log("No data to display.");
    return;
  }

  const head = options.head ?? Object.keys(data[0] as object);

  const table = new Table({ head });

  for (const row of data) {
    const values = Object.values(row).map((val) => {
      const str = String(val ?? "");
      return options.truncate
        ? str.slice(0, options.truncate) +
            (str.length > options.truncate ? "…" : "")
        : str;
    });
    table.push(values);
  }

  console.log(table.toString());
}
