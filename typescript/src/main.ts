import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Log a message when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

// Login to Discord with the bot token
client.login(process.env.BOT_TOKEN).catch((error) => {
  console.error('Failed to login:', error);
});

