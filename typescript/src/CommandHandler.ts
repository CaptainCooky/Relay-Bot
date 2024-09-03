import { Client, Collection, CommandInteraction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);

export class CommandHandler {
  private client: Client | undefined;
  private commands: Collection<string, any>;

  constructor(client?: Client) {
    this.client = client;
    this.commands = new Collection();

    this.loadCommands();
  }

  private loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log(`Loading commands from ${commandsPath}`);

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      console.log(`Loading command from file: ${file}`);

      import(pathToFileURL(filePath).href).then((command) => {
        const commandData = command.data || command.default?.data;

        if (!commandData || !commandData.name) {
          console.error(`Command ${file} is missing a name property.`);
          return;
        }

        console.log(`Command ${commandData.name} loaded successfully.`);
        this.commands.set(commandData.name, command);
      }).catch((error) => {
        console.error(`Failed to load command from file ${file}:`, error);
      });
    }
  }

  public getCommands() {
    return this.commands;
  }

  public async handleCommand(interaction: CommandInteraction) {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      console.log(`Executing command: ${interaction.commandName}`);
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}
