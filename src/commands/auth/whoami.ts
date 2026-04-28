import { catchAndLogError } from "@/src/lib/utils";
import { loadCredentials } from "@/src/misc/credentials";
import { intro, log } from "@clack/prompts";
import { Command } from "commander";

export const whoamiCommand = new Command()
  .command("whoami")
  .description("Identify yourself")
  .action(() => {
    catchAndLogError(async () => {
      intro("Checking...");
      const credentials = loadCredentials(false);
      if (credentials?.username) {
        log.info("You're logged in as: " + credentials.username);
      } else {
        log.warning("You are not logged in");
      }
    });
  });
