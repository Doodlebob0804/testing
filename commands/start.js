const fetch = require('node-fetch')
let currSeconds = 0;
let timer;

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    
    let connection = await vc.join();

    let callback = async (newMsg) => {
        if(newMsg.author !== message.author) return;
        if(newMsg.channel !== message.channel) return;
        if(!newMsg.content) return;
        if(newMsg.content === "%end") {
            message.channel.send("Ended")
            return client.removeListener('message', callback);
        }

        let text = newMsg.content.replace(/[^\x00-\x7F]/g, '')
        let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${text}`)
        
        connection.play(out.body);
    }

    restartTimer(client, callback, message.channel)

    client.on('message', callback)
    message.channel.send('Started')
}

function startTimer(client, callback, channel) {
    currSeconds++;
    if(currSeconds > 240) {
        clearInterval(timer);
        channel.send("Timed out")
        return client.removeListener('message', callback);
    }
}

function restartTimer(client, callback, channel) {
    clearInterval(timer);
    currSeconds = 0;
    timer = setInterval(startTimer, 1000, client, callback, channel);
}

exports.help = {
    "name": "start",
    "description": "start a tts instance"
}