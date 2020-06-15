const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const { token, defaultPrefix } = require('./config.json')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.help.name, command);

    console.log(`Loaded ${file}`)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(!message.content.startsWith(defaultPrefix)) return;

    let args = message.content.slice(defaultPrefix.length).split(' ');
    let commandName = args.shift().toLowerCase();
    
    let command = client.commands.get(commandName)
    if(command) command.run(client, message, args)
})

client.login(token);