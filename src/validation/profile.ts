import z from "zod";
import { AgeGroup } from "@/src/misc/types";

export const createProfileSchema = z.object({
  name: z
    .string({
      error: "name is invalid",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      error: "name must only contain letters",
    })
    .nonoptional({
      error: "name is required",
    })
    .describe("The name of the profile"),
});

export const profileSearchSchema = z
  .string({ error: "Your search query must have at least 5 characters" })
  .min(5, { error: "Your search query must have at least 5 characters" });

export const profileQuerySchema = z
  .object({
    gender: z
      .enum(["male", "female"], {
        error: "gender must be 'female' or 'male'",
      })
      .optional()
      .describe(
        "Filter profiles by gender. Accepted values: 'male' or 'female'",
      ),

    country_id: z
      .string({
        error: "country_id must be a string",
      })
      .optional()
      .describe(
        "Filter profiles by ISO 3166-1 alpha-2 country code (e.g. 'NG', 'GH')",
      ),

    age_group: z
      .enum(AgeGroup)
      .optional()
      .describe(
        "Filter profiles by age group. Accepted values: " +
          Object.keys(AgeGroup).join(", "),
      ),

    min_age: z.coerce
      .number({
        error: "min_age must be a number",
      })
      .int({ error: "min_age must be an integer" })
      .min(0, { error: "min_age cannot be negative" })
      .optional()
      .describe(
        "Minimum age filter (inclusive). Must be a non-negative integer",
      ),

    max_age: z.coerce
      .number({
        error: "max_age must be a number",
      })
      .int({ error: "max_age must be an integer" })
      .min(0, { error: "max_age cannot be negative" })
      .optional()
      .describe(
        "Maximum age filter (inclusive). Must be a non-negative integer and >= min_age",
      ),

    min_gender_probability: z.coerce
      .number({
        error: "min_gender_probability must be a number",
      })
      .min(0, { error: "min_gender_probability must be >= 0" })
      .max(1, { error: "min_gender_probability must be <= 1" })
      .optional()
      .describe(
        "Minimum confidence score for gender prediction. Accepted range: 0–1",
      ),

    min_country_probability: z.coerce
      .number({
        error: "min_country_probability must be a number",
      })
      .min(0, { error: "min_country_probability must be >= 0" })
      .max(1, { error: "min_country_probability must be <= 1" })
      .optional()
      .describe(
        "Minimum confidence score for country prediction. Accepted range: 0–1",
      ),

    sort_by: z
      .enum(["age", "created_at", "gender_probability"], {
        error: "sort_by must be one of: age, created_at, gender_probability",
      })
      .optional()
      .describe(
        "Field to sort results by. Accepted values: 'age', 'created_at', 'gender_probability'",
      ),

    order: z
      .enum(["asc", "desc"], {
        error: "order must be either 'asc' or 'desc'",
      })
      .default("asc")
      .optional()
      .describe("Sort direction. Accepted values: 'asc' (default) or 'desc'"),

    page: z.coerce
      .number({
        error: "page must be a number",
      })
      .int({ error: "page must be an integer" })
      .min(1, { error: "page must be >= 1" })
      .default(1)
      .optional()
      .describe(
        "Page number for pagination. Must be a positive integer. Defaults to 1",
      ),

    limit: z.coerce
      .number({
        error: "limit must be a number",
      })
      .int({ error: "limit must be an integer" })
      .min(1, { error: "limit must be >= 1" })
      .max(50, { error: "limit cannot exceed 50" })
      .default(10)
      .optional()
      .describe(
        "Number of results per page. Must be between 1 and 50. Defaults to 10",
      ),
  })
  .refine(
    (data) => {
      if (data.min_age !== undefined && data.max_age !== undefined) {
        return data.max_age >= data.min_age;
      }
      return true;
    },
    {
      message: "max_age cannot be lower than min_age",
      path: ["max_age"],
    },
  );

export const ProfileIdSchema = z.uuid().describe("ID of the profile");

export const ProfileExportSchema = z.object({
  format: z
    .enum(["csv"], {
      error: "format must be 'csv'",
    })
    .describe("Export file format. Accepted values: 'csv'"),
});
