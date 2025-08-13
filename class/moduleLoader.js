require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs/promises')

class ModuleLoader {
  commands;
  modals;
  buttons;
  
  constructor() {
    this.commands = {};
    this.modals = {};
    this.buttons = {};
  }

  async registerCommands () {
    const commands = await this.loadCommands(true);
    const rest = new Discord.REST().setToken(process.env.TOKEN)

    try {
      console.log('SlashCommandsを登録中...')
      await rest.put(
        Discord.Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands[1] }
      )
      console.log('SlashCommandsを登録完了!!')
    } catch (e) {
      console.log(`Error: ${e}`)
    }
  }

  async loadCommands (sendLog = false) {
    const files = await fs.readdir('./cmds/');
    const commandFiles = files.filter(file => file.endsWith('.js'));

    let successCount = 0;
    let errorCount = 0;

    const errorCommands = [];
    const successCommands = [];

    const CMDS_PATH = '../cmds/';

    for (const file of commandFiles) {
      const command = require(CMDS_PATH + file);
      delete require.cache[require.resolve(CMDS_PATH + file)];
      if (!command.data) {
        errorCount++;
        errorCommands.push(file);
        continue;
      }
      successCommands.push(file);
      this.commands[command.data.name] = command;
      successCount++;
    }

    const commandData = [];
    for (const commandName in this.commands) {
      commandData.push(this.commands[commandName].data)
    }

    if (sendLog) {
      const loadedCommands = successCommands.join('\n+ ');
      const lineMessage = `Loaded ${successCount} slash command${successCount > 1 ? 's' : ''}.\n+ ${loadedCommands}`;
      const failedCommands = errorCommands.join('\n- ');
      const fullMessage = lineMessage + ((errorCount) ? `\nFailed to load ${errorCount} slash command${errorCount > 1 ? 's' : ''}.\n- ${failedCommands}` : '');
      console.log(fullMessage);
      // console.log("\nファイル名表示はConfigからオフにできます。")
    }

    return [this.commands, commandData];
  }

  async loadModals () {
    const files = await fs.readdir('./modals/');
    const modalFiles = files.filter(file => file.endsWith('.js'));

    let successCount = 0;
    let errorCount = 0;

    const successModals = [];
    const errorModals = [];

    const MODALS_PATH = '../modals/';

    for (const file of modalFiles) {
      const modal = require(MODALS_PATH + file);
      delete require.cache[require.resolve(MODALS_PATH + file)];
      if (!modal.id) {
        errorCount++;
        errorModals.push(file);
        continue;
      }
      successCount++;
      successModals.push(file);
      this.modals[modal.id] = modal;
    }

    const loadedModals = successModals.join('\n+ ');
    const lineMessage = `Loaded ${successCount} modal function${successCount > 1 ? 's' : ''}.\n${successCount > 0 ? '+' : 'Nothing'} ${loadedModals}`;
    const failedModals = errorModals.join('\n- ');
    const fullMessage = lineMessage + ((errorCount) ? `\nFailed to load ${errorCount} modal function${errorCount > 1 ? 's' : ''}.\n- ${failedModals}` : '');

    console.log(fullMessage);

    return this.modals;
  }

  async loadButtons () {
    const files = await fs.readdir('./buttons/'); 
    const buttonFiles = files.filter(file => file.endsWith('.js'));

    let successCount = 0;
    let errorCount = 0;

    const errorButtons = [];
    const successButtons = [];

    const BUTTONS_PATH = '../buttons/';

    for (const file of buttonFiles) {
      const button = require(BUTTONS_PATH + file);
      delete require.cache[require.resolve(BUTTONS_PATH + file)];
      if (!button.id) {
        errorCount++;
        errorButtons.push(file);
        continue;
      }
      successButtons.push(file);
      this.buttons[button.id] = button;
      successCount++;
    }

    const loadedButtons = successButtons.join('\n+ ');
    const lineMessage = `Loaded ${successCount} button function${successCount > 1 ? 's' : ''}.\n${successCount > 0 ? '+' : 'Nothing'} ${loadedButtons}`;
    const failedButtons = errorButtons.join('\n- ');
    const fullMessage = lineMessage + ((errorCount) ? `\nFailed to load ${errorCount} button function${errorCount > 1 ? 's' : ''}.\n- ${failedButtons}` : '');

    console.log(fullMessage);

    return this.buttons;
  }
}

module.exports = { ModuleLoader };
