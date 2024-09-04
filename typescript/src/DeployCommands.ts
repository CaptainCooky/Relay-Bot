import { REST, Routes } from 'discord.js';
import { CommandHandler } from './CommandHandler.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve necessary environment variables
const token = process.env.BOT_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;

if (!token || !clientId || !guildId) {
  throw new Error('BOT_TOKEN, CLIENT_ID, and GUILD_ID must be set in the .env file.');
}

export class DeployCommands {
  private commandHandler: CommandHandler;
  private rest: REST;

  constructor() {
    // The non-null assertion operator '!' ensures that token is treated as a string
    this.commandHandler = new CommandHandler(undefined);
    this.rest = new REST({ version: '10' }).setToken(token); // 'token!' assures TypeScript it's not undefined
  }

  public async deploy() {
    // Load commands asynchronously
    await this.commandHandler.loadCommands();

    const commands = this.commandHandler.getCommands().map(command => {
      console.log(`Registering command: ${command.data.name}`); // Log the command name
      return command.data.toJSON();
    });

    try {
      console.log('Started refreshing application (/) commands.');

      // // Clear existing commands
      // await this.rest.put(
      //   Routes.applicationGuildCommands(clientId, guildId), // 'clientId!' and 'guildId!' assures TypeScript it's not undefined
      //   { body: [] }
      // );

      // Register commands for a specific guild (server)
      await this.rest.put(
        Routes.applicationGuildCommands(clientId, guildId), // 'clientId!' and 'guildId!' assures TypeScript it's not undefined
        { body: commands }
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error('Error reloading application (/) commands:', error);
    }
  }
}
