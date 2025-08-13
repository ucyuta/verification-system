const { ButtonInteraction , EmbedBuilder} = require("discord.js")
const fs = require("fs");
const Markdown = require("discord-bettermarkdown");
const { Convert, messageOptions, verifyModalGameType } = require("../class/utils");

module.exports = {
    id: "verify",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction){
        const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
        let guildData = file.find(data => data.guildid === interaction.guildId);
        const verifiRoleId = guildData.verifyRoleId;
        const role = interaction.guild.roles.cache.get(verifiRoleId);
        const errorTitle = "\`\`\`ansi\n" + "Error".red.bgDarkBlue + "\n\`\`\`";
        
        if(!role){
            const msg = `${errorTitle}\n**__:warning: ロールが見つかりませんでした__**\n\n-もう一度お試しください\n-管理者にお問い合わせください`
            return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
        }

        if(interaction.member.roles.cache.some(r => r.id === role.id)){
            const msg = `${errorTitle}\n**__:warning: あなたはすでにロールを所持しています__**\n\n-認証は完了しています`
            return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
        }

        try {
            await interaction.member.roles.add(role);
        } catch(e) {
            const msg = `${errorTitle}\n**__:warning: ロールの付与に失敗しました__**\n\n-もう一度お試しください\n-管理者にお問い合わせください`
            return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
        }

        const successTitle = "\`\`\`ansi\n" + "Success".green.bgDarkBlue + "\n\`\`\`";
        const msg = `${successTitle}\n**__:white_check_mark: 認証に成功しました__**`
        return await sendMessage(msg, interaction.replied, messageOptions.color.SUCCESS, true)

        async function sendMessage(message, replied, color, epheme){
            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription(message)
                .setTimestamp()
                .setFooter({ text: "Powered by yutasaba"})

            if(replied){
                await interaction.editReply({ embeds: [embed]})
            }else{
                await interaction.reply({ embeds: [embed], ephemeral: epheme});
            }
        }
    }
}