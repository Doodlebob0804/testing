const fetch = require('node-fetch')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');

    if(client.currUsers.find(user => user.guild === message.guild.id && user.id !== message.author.id)) return message.channel.send('Someone is already using this bot in this server.')
    if(client.currUsers.find(user => user.id === message.author.id)) return message.channel.send('You have already started this bot, please end the current instance before starting a new one.');
    await client.currUsers.push({id: message.author.id, guild: message.guild.id});
    
    let connection = await vc.join();
    let timeout;

    let callback = async (newMsg) => {
        if(newMsg.author !== message.author) return;
        if(newMsg.channel !== message.channel) return;
        if(!newMsg.member.voice.channel) return;
        if(newMsg.member.voice.channel !== vc) return;
        if(!newMsg.content) return;
        if(newMsg.content === "%end") {
            return end(client, callback, voiceCallback, timeout, message);
        }

        clearTimeout(timeout);
        timeout = setTimeout(end, 300000, client, callback, voiceCallback, timeout, message)

        let text = newMsg.content.replace(/[^\x00-\x7F]/g, '')
        text = text.replace(/[%#]/g, '')
        let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`)
        
        connection.play(out.body);
    }

    let voiceCallback = (oldState, newState) => {
        if(!newState.channel && newState.member === message.member) {
            client.removeListener('message', callback)
            client.removeListener('voiceStateUpdate', voiceCallback)
            clearTimeout(timeout);
            let user = client.currUsers.find(user => user.id === newState.member.id)
            client.currUsers = client.currUsers.filter(users => users !== user);
            oldState.channel.leave();
            return message.channel.send("Ended");
        } else if(!newState.channel && newState.member.id === client.user.id && newState.guild === message.guild){
            console.log("audioRan")
            client.removeListener('message', callback)
            client.removeListener('voiceStateUpdate', voiceCallback);
            clearTimeout(timeout);
            let user = client.currUsers.find(user => user.guild === oldState.guild.id)
            client.currUsers = client.currUsers.filter(users => users !== user);
            oldState.channel.leave();
            return message.channel.send("Ended");
        }
    }

    timeout = setTimeout(end, 300000, client, callback, voiceCallback, timeout, message)

    client.on('message', callback)
    client.on('voiceStateUpdate', voiceCallback)
    message.channel.send('Started');
}

async function end(client, callback, voiceCallback, timeout, message) {
    client.removeListener('message', callback);
    client.removeListener('voiceStateUpdate', voiceCallback)
    clearTimeout(timeout);
    let user = client.currUsers.find(user => user.id === message.member.id)
    client.currUsers = client.currUsers.filter(users => users !== user);
    if(await message.guild.fetch()) {
        message.member.voice.channel.leave();
        return message.channel.send("Ended");
    }
}

exports.help = {
    "name": "start",
    "description": "start a tts instance"
}