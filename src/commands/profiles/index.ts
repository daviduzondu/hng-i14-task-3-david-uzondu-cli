import { Command } from "commander";
import { createProfileCommand } from "./create";
import { searchProfilesCommand } from "@/src/commands/profiles/search";
import { listProfilesCommand } from "@/src/commands/profiles/list";
import { getProfileCommand } from "@/src/commands/profiles/get";
import { intro } from "@clack/prompts";

export const profilesCommand = new Command("profiles")
  .description("Manage profiles")
  .addCommand(createProfileCommand)
  .addCommand(searchProfilesCommand)
  .addCommand(listProfilesCommand)
  .addCommand(getProfileCommand)