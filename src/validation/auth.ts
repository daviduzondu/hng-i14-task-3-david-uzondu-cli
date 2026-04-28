import z from "zod";

export const githubCallbackSchema = z.object({
  code_verifier: z.string(),
  code: z.string(),
});

export const credentialsSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  username: z.string(),
  role: z.string(),
});
