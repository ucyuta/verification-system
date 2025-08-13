const { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const { messageBuilder, messageType, messageLangType } = require("../class/utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setbiochannel")
        .setDescription("自己紹介チャンネルを設定します")
        .addChannelOption(option => option
            .setName("biochannel")
            .setDescription("チャンネルを選択")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement)    
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        await interaction.deferReply();
        const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
        const channel = interaction.options.getChannel("biochannel");
        const guild = interaction.guild;
        let guildData = file.find(g => g.guildid == interaction.guild.id);
        if (!guildData) {
            file.push({
              guildid: guild.id,
              ownerid: guild.ownerId,
              verifyChannel:null,
              verifyDatas:[],
              biochannel: null
            })

            guildData = file.find(data => data.guildid === interaction.guildId);
        }

        file.forEach(data => {
            if(data.guildid !== interaction.guild.id) return;
            data.biochannel = channel.id;
        })

        fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)));

        const msg = new messageBuilder()
            .setMessage(`自己紹介チャンネルを設定しました\nチャンネル: <#${channel.id}>`)
            .setType(messageType.SUCCESS)
            .Build(messageLangType.ENGLISH)
        await interaction.editReply({ embeds: [msg]});
        return;
    }
}