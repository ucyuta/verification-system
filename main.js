const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client({ 
    intents: Object.values(Discord.GatewayIntentBits)
});
const { loads } = require("./register-commands/register-command");
let commands = loads.loadCommands();
let modals = loads.loadModals();
let buttons = loads.loadButtons();

require("dotenv").config();

client.once("ready", async () => {
    await loads.registerCommands();
    console.log("ready..")
})

client.on("messageCreate", async (message) => {
    if(message.author.bot) return;

    if(message.content == "register-commands"){
        await loads.registerCommands();
        commands = loads.loadCommands();
        return message.reply("registered")
    }

    if(message.content == "register-modals"){
        modals = loads.loadModals();
        return message.reply("registered")
    }

    if(message.content == "register-buttons"){
        buttons = loads.loadButtons();
        return message.reply("registered")
    }
})

client.on("guildCreate", (guild) => {
  const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
  const checkMatch = file.find(f => f.guildid == guild.id);
  if(checkMatch) {
    console.log(`${guild.name} : ${guild.id} | このサーバーは正常にデータが削除できてなかったようです。\nデータの削除を実行します。以前のデータ>\n${JSON.stringify(file.filter(f=> f.guildid == guild.id))}`);
    file.map(f => {
      if(f.guildid == guild.id) {
        delete f;
      }
    });
  }

  let msg = `+ Join > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`;

  console.log(msg);

  file.push({
    guildid: guild.id,
    ownerid: guild.ownerId,
    verifiChannel: null,
    verifiDatas: []
  })

  fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)));
})

client.on("guildDelete", (guild) => {
  const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
  file.map(f => {
    if(f.guildid == guild.id) {
      delete f;
    }
  });
  console.log("file : " + JSON.stringify(file));

  let msg = `- Left > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`;
  console.log(msg);

  fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)));
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
 
    const command = commands[0][interaction.commandName];
    try {
      await command.execute(interaction);
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: '実行中にエラーが発生しました',
      })
    }
  })

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const button = buttons[interaction.customId];
  try {
    await button.execute(interaction);
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: '実行中にエラーが発生しました。'
    })
      .catch(async () => await interaction.editReply({
        content: '実行中にエラーが発生しました。'
      }))
  }
})
  
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    
    const modal = modals[interaction.customId];
    try {
      await modal.execute(interaction);
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: '実行中にエラーが発生しました。'
      })
        .catch(async () => await interaction.editReply({
          content: '実行中にエラーが発生しました。'
        }))
    }
  })


client.login(process.env.TOKEN);