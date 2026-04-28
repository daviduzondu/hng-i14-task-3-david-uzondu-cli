import fs from "fs";
import path from "path";
import os from "os";
import { credentialsSchema } from "@/src/validation/auth";
import type z from "zod";

const CREDENTIALS_PATH = path.join(
  os.homedir(),
  ".insighta",
  "credentials.json",
);

export function saveCredentials(credentials: z.infer<typeof credentialsSchema>) {
  const dir = path.dirname(CREDENTIALS_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    CREDENTIALS_PATH,
    JSON.stringify(credentials, null, 2),
    "utf-8",
  );
}

export function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH))
    throw new Error("Failed to parse credentials. Try running: insighta login");
  const raw = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  const { error, data } = credentialsSchema.safeParse(JSON.parse(raw));
  if (error)
    throw new Error("Failed to parse credentials. Try running: insighta login");
  return data;
}

export function deleteCredentials() {
  if (fs.existsSync(CREDENTIALS_PATH)) fs.rmSync(CREDENTIALS_PATH);
}
