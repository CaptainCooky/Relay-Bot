import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { CommandHandler } from './CommandHandler.js';
import { DeployCommands } from './DeployCommands.js';

// Load environment variables from .env file
dotenv.config();

// Retrieve the bot token from the environment variables
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('Bot token not found. Please set BOT_TOKEN in the .env file.');
}

// Initialize the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Initialize the command handler
const commandHandler = new CommandHandler(client);

// Log a message when the bot is ready
client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Load commands for runtime so they are available
  await commandHandler.loadCommands();

  const commands = await client.application?.commands.fetch();
  console.log('Commands:', commands);
});

// Listen for interaction events (e.g., commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  try {
    await commandHandler.handleCommand(interaction);
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with the bot token
client.login(token).catch(error => {
  console.error('Failed to login:', error);
});
