const Discord = require("discord.js");

/**
 * @class A class that to convert Discord.GuildMember and User in Discord.js
 */
class Convert{
    /**
     * Convert to GuildMember
     * @param {Discord.User} user A function that returns Discord.GuildMember
     * @returns {Discord.GuildMember | Discord.User | undefined}
     */
    static toGuildMember(user){
        if(typeof user !== Discord.User || typeof user !== Discord.GuildMember){
            console.error(new TypeError("A property type must be either Discord.User or Discord.GuildMember, but it is currently a "+typeof user))
            return;
        }

        if(typeof user === Discord.GuildMember){
            return user;
        }

    }

    /**
     * Convert to User
     * @param {Discord.GuildMember} guildmember A function that returns Discord.User
     * @returns {Discord.User | Discord.GuildMember | undefined}
     */
    static toUser(guildmember){
        if(typeof guildmember !== Discord.GuildMember || typeof user !== Discord.User){
            console.error(new TypeError("A property type must be either Discord.User or Discord.GuildMember, but it is currently a "+typeof user))
            return;
        }
    }
}

/**
 * @class A class for formatting messages
 */
class messageBuilder{
    constructor(){
        this.message = null;
        this.type = null;
    }

    /**
     * Message to send
     * @param {String} message The message to use
     * @returns {messageBuilder}
     */
    setMessage(message){
        if(typeof message !== "string"){
            const err = "The property value must be a valid string. Please provide a valid string value."
            throw new TypeError(err);
        }
        if(!message.length){
            const err = "InvalidArgumentError: The property value cannot be empty. Please provide a valid value.";
            throw new Error(err);
        }

        this.message = message;
        return this;
    }

    /**
     * Select a type of message
     * @param {Number | messageType} type The message types
     * @returns {messageBuilder}
     */
    setType(type){
        if(!(typeof type === 'number' && type >= messageType.ERROR && type <= messageType.SUCCESS)){
            throw new Error("Invalid message type");
        }
        this.type = type;
        return this;
    }

    /**
     * Build a message
     * @param {String | messageLangType} lang Only "ja" or "en" can be specified for lang.
     * @returns {Discord.EmbedBuilder}
     */
    Build(lang){
        if(!this.message || !this.type){
            const err = "Required method is missing. Please make sure to call all necessary methods (e.g., setMessage, setType) before building the message."
            throw new Error(err);
        }
        if(!lang){
            throw new TypeError("Cannot read property 'lang' of undefined");
        }
        if(typeof lang !== "string"){
            const err = "The property value must be a valid string. Please provide a valid string value."
            throw new TypeError(err);
        }

        const typeKey = Object.keys(messageType).find(f => messageType[f] === this.type);

        const color = messageOptions.color[typeKey];

        const title = messageOptions.title[typeKey][lang];

        const embmsg = new Discord.EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(this.message)
            .setTimestamp()
            .setFooter({ text: "Powered by yutasaba"})

        return embmsg;
    }
}

class messageType{
    static ERROR = 0;
    static NORMAL = 1;
    static ALERT = 2;
    static SUCCESS = 3;
}

class messageLangType{
    static JAPANESE = "ja";
    static ENGLISH = "en";
}

class messageOptions{
    static color = {
        ERROR: 0xFF0000,
        NORMAL: 0xFFFFFF,
        ALERT: 0xFFFF00,
        SUCCESS: 0x00FF00
    };
    static title = {
        ERROR: {ja: "エラー", en: "Error"},
        NORMAL: {ja: "メッセージ", en: "Message"},
        ALERT: {ja: "警告", en: "Alert"},
        SUCCESS: {ja: "成功", en: "Success"}
    };
}

class verifyModalGameType{
    static 0 = {label: null, example: null, check: false};
    static 1 = {label: "MinecraftID", example: "Minecraft2024", check: false};
    static 2 = {label: "MinecraftID(BE)", example: "MinecraftBE2024", check: false};
    static 3 = {label: "MinecraftID(JE)", example: "MinecraftJE2024", check: true};
    static 4 = {label: [this[2].label, this[3].label], example: [this[2].example, this[3].example], check: [this[2].check, this[3].check]}
    static 5 = {label: "ValorantID", example: "example#0000", check: false};
    static 6 = {label: "BattlenetID", example: "example#0000", check: false};
    static 7 = {label: "ApexLegendID", exapmle: "example", check: false};
}



module.exports = { Convert, messageBuilder, messageType, messageLangType, messageOptions, verifyModalGameType }