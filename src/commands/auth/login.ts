import { Command } from "commander";

export const loginCommand = new Command()
  .command("login")
  .description("Login to your Insighta Labs+ account")
  .action(() => {
    console.log("Logging in...");
  });

