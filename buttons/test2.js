module.exports = {
  id: 'testbutton2',
  /**
     *
     * @param {import("discord.js").Interaction} interaction
     */
  async execute (interaction) {
    return await interaction.message.delete()
  }
}
