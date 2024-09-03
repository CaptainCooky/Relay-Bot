import { REST, Routes } from 'discord.js';
import { CommandHandler } from './CommandHandler.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve necessary environment variables
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error('BOT_TOKEN, CLIENT_ID, and GUILD_ID must be set in the .env file.');
}

// Initialize the command handler
const commandHandler = new CommandHandler(undefined); // We don't need the client here, just the commands

const commands = commandHandler.getCommands().map(command => command.data.toJSON());

// Create a REST client to register the commands
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Register commands for a specific guild (server)
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error reloading application (/) commands:', error);
  }
})();
