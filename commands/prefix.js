const Keyv = require('keyv');

const keyv = new Keyv('sqlite://prefix.db')

exports.run = async (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You need **Manage Server** permissions to be able to use this command.');
    if(args[0].length > 2) return message.channel.send('The prefix cannot be more than 2 characters long.');
    await keyv.set(message.guild.id, args[0]);
    return message.channel.send(`The prefix has been changed to ${args[0]}`)
}

exports.help = {
    "name": "prefix",
    "description": "Set prefix"
}