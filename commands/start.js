const fetch = require('node-fetch')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');

    if(client.currUsers.find(user => user.guild === message.guild.id && user.id !== message.author.id)) return message.channel.send('Someone is already using this bot in this server.')
    if(client.currUsers.find(user => user.id === message.author.id)) return message.channel.send('You have already started this bot, please end the current instance before starting a new one.');
    await client.currUsers.push({id: message.author.id, guild: message.guild.id});
    
    let connection = await vc.join();

    let callback = async (newMsg) => {
        if(newMsg.author !== message.author) return;
        if(newMsg.channel !== message.channel) return;
        if(!newMsg.member.voice.channel) return;
        if(newMsg.member.voice.channel !== vc) return;
        if(!newMsg.content) return;
        if(newMsg.content === "%end") {
            message.channel.send("Ended")
            let user = client.currUsers.find(user => user.id === newMsg.member.id)
            client.currUsers = client.currUsers.filter(users => users !== user);
            client.removeListener('voiceStateUpdate', voiceChannelCallback)
            return client.removeListener('message', callback);
        }

        let text = newMsg.content.replace(/[^\x00-\x7F]/g, '')
        text = text.replace(/[%#]/g, '')
        let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${text}`)
        
        connection.play(out.body);
    }

    let voiceChannelCallback = (oldState, newState) => {
        if(!newState.channel && newState.member === message.member) {
            message.channel.send("Ended");
            let user = client.currUsers.find(user => user.id === newState.member.id)
            client.currUsers = client.currUsers.filter(users => users !== user);
            client.removeListener('voiceStateUpdate', voiceChannelCallback)
            return client.removeListener('message', callback)
        }
    }

    client.on('message', callback)
    client.on('voiceStateUpdate', voiceChannelCallback)
    message.channel.send('Started')
}

exports.help = {
    "name": "start",
    "description": "start a tts instance"
}