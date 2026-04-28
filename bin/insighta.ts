import { loginCommand } from "@/src/commands/auth/login";
import { logoutCommand } from "@/src/commands/auth/logout";
import { whoamiCommand } from "@/src/commands/auth/whoami";
import { profilesCommand } from "@/src/commands/profiles";
import { intro } from "@clack/prompts";
import { Command } from "commander";
import "dotenv/config";
const program = new Command();

program.name("insighta").description("Insighta CLI").version("0.0.1");
program.addCommand(loginCommand);
program.addCommand(whoamiCommand);
program.addCommand(logoutCommand);
program.addCommand(profilesCommand);
program.parse();
