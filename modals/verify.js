const { ModalSubmitInteraction, EmbedBuilder, GuildTextBasedChannel } = require("discord.js");
const fs = require("fs");
const { Convert, messageOptions, verifyModalGameType } = require("../class/utils");
const defaultBotData = require("../default-bot-data");
const { user } = require("minecraft-search");

module.exports = {
    id: "verify_modal",
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     */
    async execute(interaction){
        const file = JSON.parse(fs.readFileSync("./files/guilds.json"));
        const guild = interaction.guild;
        let guildData = file.find(data => data.guildid === interaction.guildId);
        const verifiRoleId = guildData.verifyRoleId;
        
        const gameType = Number(guildData.verifyModalGameType);
        const errorTitle = "\`\`\`ansi\n" + "Error".red.bgDarkBlue + "\n\`\`\`";
        const regexp = /[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF# ._\-\sA-Za-z0-9А-ЯЁёا-ي\u0600-\u06FF\u0900-\u097F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u1100-\u11FF\u1200-\u137F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uD7B0-\uD7FF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF]/g;

        let gameId1 = interaction.fields.getTextInputValue("account")?.replace(regexp, "") || null;
        let gameId2 = gameType == 4 ? interaction.fields.getTextInputValue("account2")?.replace(regexp, ""): null;
        let hitokoto = interaction.fields.getTextInputValue("hitokoto");

        gameId1 = trimWhiteSpace(gameId1);
        if(gameType == 4) gameId2 = trimWhiteSpace(gameId2);
        hitokoto = trimWhiteSpace(hitokoto);

        // regexp で一致しない文字が置き換えられたあとの gameId1 か gameId2 が空文字の場合
        if(gameType >= 1 && gameType <= 7){
            if(!gameId1){
                const msg = `${errorTitle}\n**__:warning: IDが入力されていません__**\n\n-空白やバックスラッシュは無効です\n-再度、入力してください。`
                return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
            }

            if(gameType === 4){
                if(!gameId2){
                    const msg = `${errorTitle}\n**__:warning: IDが入力されていません__**\n\n-空白やバックスラッシュは無効です\n-再度、入力してください。`
                return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
                }
            }
        }
        
        // gameId1 もしくは gameId2 が no かつ gameType が Java and BE(4) で、どちらも no の場合
        if(gameId1?.toLowerCase() == "no" || gameId2?.toLowerCase() == "no"){
            if( gameType == 4 && gameId1?.toLowerCase() == "no" && gameId2?.toLowerCase() == "no"){
                const msg = `${errorTitle}\n**__:warning: IDが入力されていません__**\n\n-二つともnoを指定することはできません。\n-再度、入力してください。`
                return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
            }
        }

        // gameType が Valorant(5) もしくは Overwatch(6) かつ、 ID に「#」がない場合
        if(gameType == 5 || gameType == 6){
            if(!gameId1.includes("#")){
                const msg = `${errorTitle}\n**__:warning: IDに「#」が含まれていません__**\n\n-再度、入力してください。`
                return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
            }
        }

        // hitokoto がない、もしくは空の場合
        if(!hitokoto || !hitokoto?.length){
            const msg = `${errorTitle}\n**__:warning: ひとことがない、もしくは空白です__**\n\n-再度、入力してください。`
            return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
        }

        // gameType が JE もしくは JEandBE かつ MCJEID が存在しない場合
        if(gameType == 3 || gameType == 4){
            const gamename1 = gameType == 4 ? gameId2 : gameId1;
            if(gamename1?.toLowerCase() !== "no"){
                let users;
                try {
                    users = await user(gamename1);
                    console.log(users)
                    if(users?.errorMessage?.includes("Couldn't find any profile with name")){
                        const msg = `${errorTitle}\n**__:warning: 入力されたMCJEアカウントは存在しませんでした__**\n\n-再度、入力してください。`
                        return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
                    }
                } catch(e) {
                    const msg = `${errorTitle}\n**__:warning: 予期せぬエラーが発生しました__**\n\n-再度、入力してください。`
                        return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
                }
                if(users?.name.toLowerCase() !== gamename1.toLowerCase()){
                    const msg = `${errorTitle}\n**__:warning: 入力されたMCJEアカウントは存在しませんでした__**\n\n-再度、入力してください。`
                    return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
                }
            }
        }

        const channelNames = ["自己紹介", "ひとこと", "あいさつ"];

        /**
         * @type {GuildTextBasedChannel}
         */
        let jikosyoukaiC;

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

        if(guildData?.biochannel){
            jikosyoukaiC = interaction.guild.channels.cache.get(guildData.biochannel);
        }else{
            jikosyoukaiC = interaction.guild.channels.cache.find(
                ch => channelNames.includes(ch.name)
            );
            
            file.forEach(data => {
                if(data.guildid !== interaction.guild.id) return;
                data.biochannel = jikosyoukaiC.id;
            })

            fs.writeFileSync("./files/guilds.json", Buffer.from(JSON.stringify(file)))

            const owner = interaction.guild.members.cache.get(interaction.guild.ownerId);
            const msg = `${interaction.guild.name} : \n自己紹介チャンネルが設定されていません。サーバー内で/setbiochannel [channel]を実行してください。`;
            owner.send(msg)
                .catch(() => console.error(`DMの送信に失敗: ${owner.user.username}/${owner.id}\nサーバー: ${interaction.guild.name}/${interaction.guild.id}\nメッセージ: ${msg}`))
        }

        const role = interaction.guild.roles.cache.get(verifiRoleId);
        if(!role){
            const msg = `${errorTitle}\n**__:warning: ロールが見つかりませんでした__**\n-もう一度お試しください\n\n-管理者にお問い合わせください`
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

        if(jikosyoukaiC){
            const authorDisplayName = interaction.user.displayName;
            const authorUserName = interaction.member.user.username;
            const authorId = interaction.user.id;
            const gameIdType = gameType === 4 ? verifyModalGameType[gameType].label[0] : verifyModalGameType[gameType];
            const gameIdType2 = gameType === 4 ? verifyModalGameType[gameType].label[1] : null;
            const bioEmbed = new EmbedBuilder()
                .setAuthor({ name: `${authorDisplayName}が参加しました!!`, iconURL: "https://www.iconsdb.com/icons/preview/green/plus-xxl.png"})
                .setThumbnail(interaction.user.displayAvatarURL())
                .setDescription(`<@${authorId}> [${authorUserName}]\n\n**<ひとこと>**\n${hitokoto}\n### ${gameIdType}\n${gameId1}${gameIdType2 ? `\n### ${gameIdType2}\n${gameId2}`: ""}`)
                .setFooter({ text: authorUserName})
                .setTimestamp()
                .setColor(messageOptions.color.SUCCESS)

            try {
                await jikosyoukaiC.send({ embeds: [bioEmbed]});
            } catch(e) {
                const msg = `${errorTitle}\n**__:warning: 送信に失敗しました__**\n\n-管理者にお問い合わせください\n-もう一度お試しください`
                return await sendMessage(msg, interaction.replied, messageOptions.color.ERROR, true);
            }
        }else{
            const msg = `${errorTitle}\n**__:warning: 自己紹介チャンネルが見つかりませんでした__**\n\n-/setbiochannelコマンドを実行してください\n-管理者にお問い合わせください`
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

        function trimWhiteSpace(str) {
            // 空白のみの文字列であれば空の文字列を返す
            if (/^\s+$/.test(str)) {
              return "";
            } else {
              // 空白を含む任意の文字列の両端の空白を削除する
              return str?.trim();
            }
        }
    }
}