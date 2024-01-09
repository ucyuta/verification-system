const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: Object.values(Discord.GatewayIntentBits)
})
const { loads } = require('./register-commands/register-command')
let commands = loads.loadCommands()
let modals = loads.loadModals()
let buttons = loads.loadButtons()

require('dotenv').config()

const handleInteractionError = async (interaction, errorMessage) => {
  console.error(errorMessage)

  try {
    await interaction.deferReply()
  } catch (error) {
    console.error('リプライの作成に失敗しました。')
  }

  await interaction.editReply({ content: '実行中にエラーが発生しました ' })
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
  await loads.registerCommands()
  console.log('ready..')
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return

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
  }
})

client.on('guildCreate', (guild) => {
  let file = JSON.parse(fs.readFileSync('./files/guilds.json'))
  const checkMatch = file.find(f => f.guildid === guild.id)
  if (checkMatch) {
    console.log(`${guild.name} : ${guild.id} | このサーバーは正常にデータが削除できてなかったようです。\nデータの削除を実行します。以前のデータ>\n${JSON.stringify(file.filter(f => f.guildid === guild.id))}`)
    file = file.filter(f => !(f.guildid === guild.id))
  }

  const msg = `+ Join > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`

  console.log(msg)

  file.push({
    guildid: guild.id,
    ownerid: guild.ownerId,
    verifiChannel: null,
    verifiDatas: []
  })

  fs.writeFileSync('./files/guilds.json', Buffer.from(JSON.stringify(file)))
})

client.on('guildDelete', (guild) => {
  let file = JSON.parse(fs.readFileSync('./files/guilds.json'))
  file = file.filter(f => !(f.guildid === guild.id))
  console.log('file : ' + JSON.stringify(file))

  const msg = `- Left > ${guild.name}[${guild.id}] | OWNER ${guild.ownerId}`
  console.log(msg)

  fs.writeFileSync('./files/guilds.json', Buffer.from(JSON.stringify(file)))
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = commands[0][interaction.commandName]
  try {
    await command.execute(interaction)
  } catch (err) {
    await handleInteractionError(interaction, err.message)
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  const button = buttons[interaction.customId]
  try {
    await button.execute(interaction)
  } catch (err) {
    await handleInteractionError(interaction, err.message)
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return

  const modal = modals[interaction.customId]
  try {
    await modal.execute(interaction)
  } catch (err) {
    await handleInteractionError(interaction, err.message)
  }
})

client.login(process.env.TOKEN)
