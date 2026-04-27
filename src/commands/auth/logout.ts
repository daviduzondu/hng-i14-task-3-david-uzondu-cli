import { Command } from "commander";

export const logoutCommand = new Command()
  .command("logout")
  .description("Log out of your Insighta Labs+ account")
  .action(() => {
    console.log("Logging out...");
  });
