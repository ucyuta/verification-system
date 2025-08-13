const fs = require('fs')
const moment = require('moment')
const Discord = require('discord.js')
const { logchannel } = require('./default-bot-data')
const client = new Discord.Client({
  intents: Object.values(Discord.GatewayIntentBits),
  partials: Object.values(Discord.Partials)
})
const { ModuleLoader } = require('./class/moduleLoader');
const loader = new ModuleLoader();

let commands, modals, buttons;

require('dotenv').config();

/**
 *
 * @param {import('discord.js').Interaction} interaction
 * @param {any} errorMessage
 */
const handleInteractionError = async (interaction, errorMessage) => {
  console.error(`Error: ${(interaction.commandName ? '/' + interaction.commandName : interaction.id)} Time: ${new Date()}\n${errorMessage}`)

  try {
    await interaction.deferReply()
  } catch (error) {
    console.error('リプライの作成に失敗しました。')
  }

  await interaction.editReply({ content: '実行中にエラーが発生しました ' })
}

/**
 * 
 * @param {Discord.Channel} channel 
 * @param {Boolean} isfile
 * @param {Discord.Attachment} file
 * @param {any} message 
 */
const handleLogSending = async (message, isfile, file, channel) => {
  if(!channel) channel = client.channels.cache.get(logchannel)
  if(!message) return await handleLogSending("Error: (parameter) message is undefined")
  if(typeof message === "object"){
    message = isfile ? { files: [file], embeds: [message] } : { embeds: [message] }
  }
  return await channel.send(message)
    .catch(console.error)
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Boolean} bool
 */

function addGuildData(guild, bool){
  let file = JSON.parse(fs.readFileSync('./files/guilds.json'))
  const checkMatch = file.find(f => f.guildid === guild.id)
  if (checkMatch) {
    console.log(`${guild.name} : ${guild.id} | このサーバーは正常にデータが削除できてなかったようです。\nデータの削除を実行します。以前のデータ>\n${JSON.stringify(file.filter(f => f.guildid === guild.id))}`)
    file = file.filter(f => !(f.guildid === guild.id))
  }

  if(bool){
    const msg = `+ Join > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`

    console.log(msg)
  }

  file.push({
    guildid: guild.id,
    ownerid: guild.ownerId,
    verifyChannel:null,
    verifyDatas:[],
    biochannel: null
  })

  fs.writeFileSync('./files/guilds.json', Buffer.from(JSON.stringify(file)))
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Boolean} bool
 */

function removeGuildData(guild,bool){
  let file = JSON.parse(fs.readFileSync('./files/guilds.json'))
  file = file.filter(f => !(f.guildid === guild.id))
  console.log('file : ' + JSON.stringify(file))

  if(bool){
    const msg = `- Left > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`
    console.log(msg)
  }

  fs.writeFileSync('./files/guilds.json', Buffer.from(JSON.stringify(file)))
}

/**
 *
 * @param {String} type
 * @param {Discord.Message} message
 */

const registerAndLoad = async (type, message) => {
  switch (type) {
    case 'commands':
      await loads.registerCommands()
      commands = loads.loadCommands()
      break

    case 'modals':
      modals = loads.loadModals()
      break

    case 'buttons':
      buttons = loads.loadButtons()
      break
  }

  message.reply('registered')
}

client.once('ready', async () => {
  commands = await loader.loadCommands();
  modals = await loader.loadModals();
  buttons = await loader.loadButtons();
  await loader.registerCommands();

  console.log("ready..")
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (message.guild.id !== "1087816494198575104") return

  switch (message.content) {
    case 'register-commands':
      await registerAndLoad('commands', message)
      break

    case 'register-modals':
      await registerAndLoad('modals', message)
      break

    case 'register-buttons':
      await registerAndLoad('buttons', message)
      break

    case 'guild-autocomp':
      const file = JSON.parse(fs.readFileSync("./files/guilds.json"))
      const dataGuildIds = file.map(data => data.guildid)
      const guilds = client.guilds.cache.filter(guild => !(dataGuildIds.includes(guild.id)))

      if(!guilds.size) return message.reply("すべてのギルドのデータが作成済みです。")
      guilds.map(guild => {
        addGuildData(guild)
      })
      message.reply("登録完了")
      break
    
    case 'guild-alldel':
      const data = JSON.parse(fs.readFileSync("./files/guilds.json"))
      const allguildids = client.guilds.cache.map(guild => guild.id)
      console.log(allguildids)
      if(!data.map(d => d.guildid).length) return message.reply("ギルドデータが登録されていません。")
      client.guilds.cache.map(guild => {
        removeGuildData(guild)
      })
      message.reply("削除完了")
      break
    
  }
})

client.on('guildCreate', async (guild) => {
  addGuildData(guild, true)
  
  const attachment = new Discord.AttachmentBuilder().setName("noimage.png").setFile("./files/noimage.png")
  
  let guildicon = guild.iconURL() ? [guild.iconURL(), false] : ["attachment://noimage.png", true]

  const createdAt = moment(guild.createdAt)
  const guildDateFormated = createdAt.format("YYYY年MM月DD日HH時mm分ss秒SS");

  const nowtime = moment(Date.now())
  const nowDateFormated = nowtime.format("YYYY年MM月DD日HH時mm分ss秒SS");

  const embed = new Discord.EmbedBuilder()
    .setTitle("+ " + guild.name)
      .setColor(0x00FF00)
      .setThumbnail(guildicon[0])
      .setFields(
        {
          name: "オーナー",
          value: `${(await guild.fetchOwner()).user.username} (${guild.ownerId})`,
          inline: true
        },
        {
          name: "作成日",
          value: guildDateFormated,
          inline: true
        },
        {
          name: '\u200B',
          value: '\u200B'
        },
        {
          name: "メンバー数",
          value: guild.memberCount + "人",
          inline: true
        },
        {
          name: "参加した日",
          value: nowDateFormated,
          inline: true
        }
      )
      .setFooter({ text: "Powered by yutasaba"})
      .setTimestamp()

try {
  handleLogSending(embed, guildicon[1], attachment)
} catch(e) {
  console.error(e)
}
})

client.on('guildDelete', async (guild) => {
  removeGuildData(guild, true)

  const attachment = new Discord.AttachmentBuilder().setName("noimage.png").setFile("./files/noimage.png")
  
  let guildicon = guild.iconURL() ? [guild.iconURL(), false] : ["attachment://noimage.png", true]

  const createdAt = moment(guild.createdAt)
  const guildDateFormated = createdAt.format("YYYY年MM月DD日HH時mm分ss秒SS");

  const nowtime = moment(Date.now())
  const nowDateFormated = nowtime.format("YYYY年MM月DD日HH時mm分ss秒SS");

  const embed = new Discord.EmbedBuilder()
    .setTitle("- " + guild.name)
      .setColor(0xFF0000)
      .setThumbnail(guildicon[0])
      .setFields(
        {
          name: "オーナー",
          value: `${(await guild.fetchOwner()).user.username} (${guild.ownerId})`,
          inline: true
        },
        {
          name: "作成日",
          value: guildDateFormated,
          inline: true
        },
        {
          name: '\u200B',
          value: '\u200B'
        },
        {
          name: "メンバー数",
          value: guild.memberCount + "人",
          inline: true
        },
        {
          name: "参加した日",
          value: nowDateFormated,
          inline: true
        }
      )
      .setFooter({ text: "Powered by yutasaba"})
      .setTimestamp()

  handleLogSending(embed, guildicon[1], attachment)
    .catch(console.error)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return
  if (!interaction.guild){
    return interaction.reply("ギルド内でのみ使用できます。")
  }

  const command = commands[0][interaction.commandName]
  //try {
    await command.execute(interaction)
  //} catch (err) {
    //await handleInteractionError(interaction, err.message);
  //}
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return
  if (!interaction.guild){
    return interaction.reply("ギルド内でのみ使用できます。")
  }

  const button = buttons[interaction.customId]
  try {
    await button.execute(interaction)
  } catch (err) {
    await handleInteractionError(interaction, err.message);
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (!interaction.guild){
    return interaction.reply("ギルド内でのみ使用できます。")
  }

  const modal = modals[interaction.customId]
  try {
    await modal.execute(interaction)
  } catch (err) {
    await handleInteractionError(interaction, err.message);
  }
})

client.login(process.env.TOKEN)

// Node.js関連

process.on("SIGINT", () => {
  console.log("Ctrl+Cで終了されます。")
  process.exit(0);
})

process.on("exit", () => {
  console.log("code 0 で終了されました");
})

process.on("SIGHUP", () => {
  process.exit(0);
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});