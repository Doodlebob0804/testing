const Discord = require('discord.js');
const fs = require('fs');
const Keyv = require('keyv');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.currUsers = [];
const keyv = new Keyv('sqlite://prefix.db')

const { token, defaultPrefix } = require('./config.json')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.help.name, command);

    console.log(`Loaded ${file}`)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({activity: { name: 'Ping me or type %help' }, status: 'online' })
});

client.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    if(message.mentions.has(client.user.id, {'ignoreEveryone': true, 'ignoreRoles': true })) return client.commands.get('help').run(client, message, undefined);

    let prefix = await keyv.get(message.guild.id) || defaultPrefix;
    if(message.content.startsWith(defaultPrefix)) prefix = defaultPrefix;
    if(!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).split(' ');
    let commandName = args.shift().toLowerCase();
    
    let command = client.commands.get(commandName)
    if(command) command.run(client, message, args)
})

client.on('voiceStateUpdate', (oldState, newState) => {
    let user = client.currUsers.find(user => user.guild === oldState.guild.id);
    if(!user) return;
    if(!newState.channel && newState.id === user.id) {
       return user.collector.stop();
    } else if(!newState.channel && newState.member.id === client.user.id && newState.guild.id === user.guild) {
        return user.collector.stop();
    }
})

client.login(token);