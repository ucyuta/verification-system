require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')

class loads {
  static async registerCommands () {
    const commands = loads.loadCommands('n')
    const rest = new Discord.REST().setToken(process.env.TOKEN)

    try {
      console.log('SlashCommandsを登録中...')
      await rest.put(
        Discord.Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands[1] }
      )
      console.log('SlashCommandsを登録完了!!')
    } catch (e) {
      console.log(`Error: ${e}`)
    }
  }

  static loadCommands (v) {
    const b = v
    const _commands = {}
    const _files = fs.readdirSync('./cmds/').filter(file => file.endsWith('.js'))

    let _count = 0
    let _errcount = 0
    const _errors = []
    const _oks = []
    const _path = '../cmds/'

    for (const i of _files) {
      const _command = require(_path + i)
      delete require.cache[require.resolve(_path + i)]
      if (!_command.data) {
        _errcount++
        _errors.push(i)
        continue
      }
      _oks.push(i)
      _commands[_command.data.name] = _command
      _count++
    }

    const _data = []
    for (const commandName in _commands) {
      _data.push(_commands[commandName].data)
    }

    if (b !== 'n') {
      const LoadedCMDs = _oks.join('\n+ ')
      const LoadMsg = `Loaded ${_count} slash command${_count > 1 ? 's' : ''}.\n+ ${LoadedCMDs}`
      const errorCMDs = _errors.join('\n- ')
      const AllLoadMsg = LoadMsg + ((_errcount) ? `\nFailed to load ${_errcount} slash command${_errcount > 1 ? 's' : ''}.\n- ${errorCMDs}` : '')
      console.log(AllLoadMsg)
      // console.log("\nファイル名表示はConfigからオフにできます。")
    }

    return [_commands, _data]
  }

  static loadModals () {
    const modals = {}
    const files = fs.readdirSync('./modals/').filter(file => file.endsWith('.js'))

    let count = 0
    let errcount = 0
    const errors = []
    const oks = []
    const _path = '../modals/'

    for (const i of files) {
      const modal = require(_path + i)
      delete require.cache[require.resolve(_path + i)]
      if (!modal.id) {
        errcount++
        errors.push(i)
        continue
      }
      oks.push(i)
      modals[modal.id] = modal
      count++
    }

    const LoadedMDLs = oks.join('\n+ ')
    const LoadMsg = `Loaded ${count} modal function${count > 1 ? 's' : ''}.\n${count > 0 ? '+' : 'Nothing'} ${LoadedMDLs}`
    const errorMDLs = errors.join('\n- ')
    const AllLoadMsg = LoadMsg + ((errcount) ? `\nFailed to load ${errcount} modal function${errcount > 1 ? 's' : ''}.\n- ${errorMDLs}` : '')

    console.log(AllLoadMsg)

    return modals
  }

  static loadButtons () {
    const buttons = {}
    const files = fs.readdirSync('./buttons/').filter(file => file.endsWith('.js'))

    let count = 0
    let errcount = 0
    const errors = []
    const oks = []
    const _path = '../buttons/'

    for (const i of files) {
      const button = require(_path + i)
      delete require.cache[require.resolve(_path + i)]
      if (!button.id) {
        errcount++
        errors.push(i)
        continue
      }
      oks.push(i)
      buttons[button.id] = button
      count++
    }

    const LoadedBTNs = oks.join('\n+ ')
    const LoadMsg = `Loaded ${count} button function${count > 1 ? 's' : ''}.\n${count > 0 ? '+' : 'Nothing'} ${LoadedBTNs}`
    const errorBTNs = errors.join('\n- ')
    const AllLoadMsg = LoadMsg + ((errcount) ? `\nFailed to load ${errcount} button function${errcount > 1 ? 's' : ''}.\n- ${errorBTNs}` : '')

    console.log(AllLoadMsg)

    return buttons
  }
}

module.exports = { loads }
