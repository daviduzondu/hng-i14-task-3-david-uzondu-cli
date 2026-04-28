import { catchAndLogError } from "@/src/lib/utils";
import { loadCredentials } from "@/src/misc/credentials";
import { Command } from "commander";
import ora from "ora";

export const whoamiCommand = new Command()
  .command("whoami")
  .description("Identify yourself")
  .action(() => {
    const spinner = ora({
      spinner: "dots3",
    });
    catchAndLogError(async () => {
      spinner.start("Checking...");
      const credentials = loadCredentials();
      spinner.succeed("You're logged in as: " + credentials.username);
    }, spinner);
  });
