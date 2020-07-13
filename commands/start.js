const fetch = require('node-fetch')
const Keyv = require('keyv');
const config = require('../config.json')

const keyv = new Keyv('sqlite://prefix.db')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');

    if(client.currUsers.find(user => user.guild === message.guild.id && user.id !== message.author.id)) return message.channel.send('Someone is already using this bot in this server.')
    if(client.currUsers.find(user => user.id === message.author.id)) return message.channel.send('You have already started this bot, please end the current instance before starting a new one.');
    
    await client.currUsers.push({id: message.author.id, guild: message.guild.id, collector: null});

    let connection;
    try {
        connection = await vc.join();
    } catch(error) {
        let user = client.currUsers.find(user => user.id === message.member.id)
        client.currUsers = client.currUsers.filter(users => users !== user);
        return;
    }
    
    let prefix = await keyv.get(message.guild.id) || config.defaultPrefix;
    
    let filter = newMsg => newMsg.author.id === message.author.id && newMsg.channel.id === message.channel.id && newMsg.member.voice.channel === vc && newMsg.content;
    let collector = message.channel.createMessageCollector(filter, { idle: 300000 });

    collector.on('collect', async newMsg => {
        if(newMsg.content === `${prefix}end`) {
            collector.stop();
        }

        let text = newMsg.content.replace(/[^\x00-\x7F]/g, '')
        text = text.replace(/[%#]/g, '')
        text = text.replace(/&/g, 'and')
        text = text.replace(/(<a?:)(.+?)(:[0-9]+>)/g, `$2`)
        let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`)
        
        connection.play(out.body);
    });

    collector.on('end', async () => {
        let user = client.currUsers.find(user => user.id === message.member.id)
        client.currUsers = client.currUsers.filter(users => users !== user);
        try {
            let vc = message.member.voice.channel || client.voice.connections.find(connection => connection.channel.guild.id === user.guild).channel;
            vc.leave();
            return message.channel.send("Ended");
        } catch(e) {
            console.log(e);
        }
    })

    let index = client.currUsers.findIndex(obj => obj.id === message.author.id && obj.guild === message.guild.id);
    client.currUsers[index].collector = collector;

    message.channel.send('Started');
}

exports.help = {
    "name": "start",
    "description": "start a tts instance"
}