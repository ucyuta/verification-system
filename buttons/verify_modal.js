const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ActionRow } = require("discord.js")
const fs = require("fs");
const { verifyModalGameType } = require("../class/utils");
const Markdown = require("discord-bettermarkdown");

module.exports = {
    id: "verify_modal",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction){
        const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
        const guildData = file.find(data => data.guildid == interaction.guild.id);
        const gameType = Number(guildData.verifyModalGameType);
        const gameTypeData = verifyModalGameType[gameType];
        let showModal;

        const modal = new ModalBuilder()
            .setCustomId("verify_modal")
            .setTitle(`認証システム`)
        
        const hitokoto = new TextInputBuilder()
            .setCustomId("hitokoto")
            .setLabel("自己紹介を記入してください。")
            .setPlaceholder("改行できます マークダウンを使用できます。")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        
        const rowh = new ActionRowBuilder().addComponents(hitokoto);

        switch (gameType){
            case 0:
                showModal = modal.addComponents(rowh);
                break;
            
            case 4:
                const account1 = new TextInputBuilder()
                    .setCustomId("account")
                    .setLabel(`あなたの${gameTypeData.label[0]}を記入してください。 (無い場合はno)`)
                    .setPlaceholder(`例: ${gameTypeData.example[0]} または 例: no`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const account2 = new TextInputBuilder()
                    .setCustomId("account2")
                    .setLabel(`あなたの${gameTypeData.label[1]}を記入してください。(無い場合はno)`)
                    .setPlaceholder(`例: ${gameTypeData.example[1]} または 例: no`)
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(1)
                    .setRequired(true)

                const row1 = new ActionRowBuilder().addComponents(account1);
                const row2 = new ActionRowBuilder().addComponents(account2);

                showModal = modal.addComponents(row1, row2, rowh);
                break;

            default:
                const account = new TextInputBuilder()
                    .setCustomId("account")
                    .setLabel(`あなたの${gameTypeData.label}を記入してください。`)
                    .setPlaceholder(`例: ${gameTypeData.example}`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const rowA = new ActionRowBuilder().addComponents(account);

                showModal = modal.addComponents(rowA, rowh);
        }

        await interaction.showModal(showModal);
    }
}