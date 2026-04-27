import { Command } from "commander";

export const whoamiCommand = new Command()
  .command("whoami")
  .description("Identify yourself")
  .action(() => {});
