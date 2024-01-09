const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
  data: {
    name: 'create-button',
    description: 'testbutton'
  },
  /**
     *
     * @param {import('discord.js').Interaction} interaction
     */
  async execute (interaction) {
    const testbutton = new ButtonBuilder()
      .setCustomId('testbutton')
      .setLabel('testbutton')
      .setStyle(ButtonStyle.Primary)

    const testbutton2 = new ButtonBuilder()
      .setCustomId('testbutton2')
      .setLabel('deleteIt')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder()
      .addComponents(testbutton, testbutton2)

    await interaction.reply({
      content: 'Hello, its a test button. Do you want delete it message?',
      components: [row]
    })
  }
}
