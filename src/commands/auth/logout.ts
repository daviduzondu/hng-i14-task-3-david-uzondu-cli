import { request } from "@/src/lib/api";
import { deleteCredentials } from "@/src/misc/credentials";
import { Command } from "commander";
import { intro, log, outro } from "@clack/prompts";

export const logoutCommand = new Command()
  .command("logout")
  .description("Log out of your Insighta Labs+ account")
  .action(async () => {
    intro("Logging out...");
    const result = await request({
      url: "/auth/logout",
      method: "post",
    });
    if (result.status === 200) {
      deleteCredentials();
      outro("Log out successful");
    } else {
      log.error("Failed to log you out");
    }
  });
