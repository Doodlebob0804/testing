const Keyv = require('keyv');
let config = require('../config.json')

const keyv = new Keyv('sqlite://prefix.db')

exports.run = async (client, message, args) => {
    let prefix = await keyv.get(message.guild.id) || config.defaultPrefix;
    return message.channel.send(`Info:\n\nThis bot allows you to speak in a voice chat without having to actually use a mic. Just type ${prefix}start and then the bot will say everything you say in chat in vc. When you don't want to bot to say your messages anymore simply type ${prefix}end and it will stop watching your messages.\n\nCommands:\n\nType: ${prefix}start to make me watch your messages and say them in vc when you send new ones.\nType: ${prefix}end to make me stop watching your messages.\nType: ${prefix}say to make me say just one message. [Ex: ${prefix}say Hi, Im VoiceTTS bot]\nType: ${prefix}ping to view the current api and gateway delay.\nType: ${prefix}prefix newprefixhere to change the prefix. [Ex: ${prefix}prefix &]\nType: ${prefix}help or ping me to see this help message.`, {code: true})
}

exports.help = {
    "name": "help",
    "description": "help command"
}