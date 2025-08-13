const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, TextChannel, GuildMember, PermissionFlagsBits } = require('discord.js')
const { colors } = require('../default-bot-data');
const fs = require('fs')
const { messageBuilder, messageType, messageLangType } = require("../class/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createembed')
    .setDescription('埋め込みメッセージを作成します')
    .addSubcommandGroup(command => command
        .setName('verify')
        .setDescription('認証用')
        .addSubcommand(subcommand => subcommand
          .setName('vf_modal')
          .setDescription('認証ボタンを押したら入力画面が表示され、送信するとロールが付与される形式')
          .addStringOption(option => option
            .setName('vf_description')
            .setDescription('埋め込みの内容を入力')
            .setRequired(true)
          )
          .addIntegerOption(option => option
            .setName('vf_color')
            .setDescription('埋め込みの色を選択')
            .addChoices(
              { name: 'default(white)', value: colors.default },
              { name: 'red', value: 0xFF0000 },
              { name: 'green', value: 0x00FF00 },
              { name: 'blue', value: 0x0000FF },
              { name: 'yellow', value: 0xFFFF00 },
              { name: 'orange', value: 0xFFA500 },
              { name: 'purple', value: 0x800080 },
              { name: 'pink', value: 0xFFC0CB },
              { name: 'brown', value: 0xA52A2A },
              { name: 'gray', value: 0x808080 },
              { name: 'black', value: 0x000000 }
            )
            .setRequired(true)
          )
          .addIntegerOption(option => option
            .setName('vf_gametype')
            .setDescription('入力させるゲームを選択')
            .addChoices(
              { name: 'Minecraft(all)', value: 1},
              { name: 'Minecraft(BE)', value: 2},
              { name: 'Minecraft(JE)', value: 3},
              { name: 'MinecraftJE and BE', value: 4},
              { name: 'Valorant', value: 5},
              { name: 'Overwatch', value: 6},
              { name: 'ApexLegends', value: 7},
              { name: "なし", value: 0}
            )
            .setRequired(true)
          )
          .addIntegerOption(option => option
            .setName('vf_buttonoption')
            .setDescription('ボタンのオプションを設定')
            .addChoices(
              { name: 'No', value: 0 },
              { name: '認証', value: 1 },
              { name: 'ここをクリック', value: 2 }
            )
            .setRequired(true)
          )
          .addRoleOption(role => role
            .setName('vf_role')
            .setDescription('認証時に付与するロールを選択')
            .setRequired(true)
          )
          .addChannelOption(option => option
            .setName('vf_channel')
            .setDescription('送信先チャンネルを選択（空白にするとこのチャンネルになります）')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement)
          )
          .addStringOption(option => option
            .setName('vf_title')
            .setDescription('タイトルを入力')
          )
          .addStringOption(option => option
            .setName("vf_author")
            .setDescription("authorを入力")
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('vf_addrole')
          .setDescription('認証ボタンを押したら即ロールが付与される従来の形式')
          .addStringOption(option => option
            .setName('vf_description')
            .setDescription('埋め込みの内容を入力')
            .setRequired(true)
          )
          .addIntegerOption(option => option
            .setName('vf_color')
            .setDescription('埋め込みの色を選択')
            .addChoices(
              { name: 'default(white)', value: colors.default },
              { name: 'red', value: 0xFF0000 },
              { name: 'green', value: 0x00FF00 },
              { name: 'blue', value: 0x0000FF },
              { name: 'yellow', value: 0xFFFF00 },
              { name: 'orange', value: 0xFFA500 },
              { name: 'purple', value: 0x800080 },
              { name: 'pink', value: 0xFFC0CB },
              { name: 'brown', value: 0xA52A2A },
              { name: 'gray', value: 0x808080 },
              { name: 'black', value: 0x000000 }
            )
            .setRequired(true)
          )
          .addIntegerOption(option => option
            .setName('vf_buttonoption')
            .setDescription('ボタンのオプションを設定')
            .addChoices(
              { name: 'No', value: 0 },
              { name: '認証', value: 1 },
              { name: 'ここをクリック', value: 2 }
            )
            .setRequired(true)
          )
          .addRoleOption(role => role
            .setName('vf_role')
            .setDescription('認証時に付与するロールを選択')
            .setRequired(true)
          )
          .addStringOption(option => option
            .setName('vf_title')
            .setDescription('タイトルを入力')
            .setRequired(false)
          )
          .addChannelOption(option => option
            .setName('vf_channel')
            .setDescription('送信先チャンネルを選択（空白にするとこのチャンネルになります）')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement)
          )
          .addStringOption(option => option
            .setName("vf_author")
            .setDescription("authorを入力")
          )
        )
    )
    .addSubcommand(subCommand => subCommand
        .setName('standard')
        .setDescription('一般的な埋め込みを作成')
        .addStringOption(option => option
            .setName('st_title')
            .setDescription('タイトルを入力')
        )
        .addStringOption(option => option
            .setName('st_description')
            .setDescription('本文を入力')
        )
        .addStringOption(option => option
            .setName('st_icon_url')
            .setDescription('アイコンをurlで指定')
        )
        .addAttachmentOption(option => option
            .setName('st_icon_file')
            .setDescription('アイコンをファイルで指定')
        )
        .addStringOption(option => option
            .setName('st_field_json')
            .setDescription('fieldをJSON形式で設定(例: [{name: "",value:"",inline:Bool}]')
        )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),
  /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
  async execute (interaction) {
    await interaction.deferReply({ ephemeral: true })
    const subcmd = interaction.options.getSubcommand()
    const v_option = interaction.options.getSubcommandGroup();
    const v_title = interaction.options.getString('vf_title')?.replace(/\s+/g, '')
    const v_desc = interaction.options.getString('vf_description')?.replace(/\s+/g, '')
    const v_color = interaction.options.getInteger('vf_color')
    const v_gametype = interaction.options.getInteger('vf_gametype')
    const v_button = interaction.options.getInteger('vf_buttonoption')
    const v_channel = interaction.options.getChannel('vf_channel') || interaction.channel;
    const v_role = interaction.options.getRole('vf_role');
    const v_author = interaction.options.getString('vf_author')
    let v_buttonS;

    switch (v_button) {
      case 0:
        v_buttonS = null
        break

      case 1:
        v_buttonS = '認証'
        break

      case 2:
        v_buttonS = 'ここをクリック'
    }

    const st_title = interaction.options.getString('st_title')
    const st_desc = interaction.options.getString('st_description')
    const st_iconURL = interaction.options.getString('st_icon_url')
    const st_iconFILE = interaction.options.getAttachment('st_icon_file')
    const st_field = interaction.options.getString('st_field_json')

    if (v_option == 'verify') {
      const file = JSON.parse(fs.readFileSync('./files/guilds.json'))
      const guild = interaction.guild;
      let guildData = file.find(data => data.guildid === guild.id);

      if (!guildData) {
        file.push({
          guildid: guild.id,
          ownerid: guild.ownerId,
          verifyChannel: null,
          verifyDatas: [],
          biochannel: null
        })
        guildData = file.find(data => data.guildid === guild.id);
      }

      file.forEach(data => {
        if(data.guildid !== interaction.guild.id) return;
        data.verifyChannel = v_channel.id;
        data.verifyRoleId = v_role.id;
      })

      fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)));

      let botrole = interaction.guild.roles.cache.find(role => role.name === interaction.client.user.username);
      let checkOtherRole = interaction.guild.members.cache.get(interaction.client.user.id).roles.cache.filter(role => !interaction.client.user.username.toLowerCase().includes(role.name.toLowerCase()));
      if(checkOtherRole && !botrole){
        botrole = checkOtherRole;
      }
      if(v_role.position > botrole.position){
        const msg = `botのロールを認証時に付与するロールより上に設定してください。\nbotrole: ${botrole}\n認証role: ${v_role}`
        const emb = new messageBuilder()
          .setMessage(msg)
          .setType(messageType.ERROR)
          .Build(messageLangType.JAPANESE)
        return await interaction.reply({ embeds: [emb]});
      }
      
      const buttonType = subcmd == 'vf_modal' ? 'verify_modal' : 'verify';

      if (subcmd == 'vf_modal') {
        file.forEach(data => {
          if(data.guildid !== interaction.guild.id) return;
          data.verifyModalGameType = v_gametype;
        })

        fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)));

      }

      const embed = new EmbedBuilder()
        .setTitle(v_title || null)
        .setAuthor(v_author ? { name: v_author } : null)
        .setDescription(v_desc)
        .setColor(v_color)

      const action = new ActionRowBuilder()

      if (v_buttonS) {
        const button = new ButtonBuilder()
          .setCustomId(buttonType)
          .setLabel(v_buttonS)
          .setStyle(ButtonStyle.Primary)

        action.addComponents(button)
      }

      try {
        await v_channel.send({ embeds: [embed], components: v_buttonS ? [action] : undefined })
      } catch (e) {
        return await interaction.editReply('送信に失敗しました。')
      }
      await interaction.editReply(`送信完了\n送信先: <#${v_channel?.id}>\n`)
      return
    }

    if (subcmd == 'standard') {
      return
    }
  }
}
