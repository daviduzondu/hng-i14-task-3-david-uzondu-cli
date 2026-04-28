import z from "zod";

export const githubCallbackSchema = z.object({
  codeVerifier: z.string(),
  code: z.string(),
});

export const credentialsSchema = z.object({
  accessToken: z.string(),
  username: z.string(),
  role: z.string(),
});
