module.exports = {
  id: 'testbutton',
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute (interaction) {
    return await interaction.reply('button-clicked')
  }
}
