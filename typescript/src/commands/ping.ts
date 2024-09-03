import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.reply('Pong!');
  } catch (error) {
    console.error('Failed to send a reply:', error);
  }
}


