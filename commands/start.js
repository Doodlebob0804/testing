const fetch = require('node-fetch')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    
    let connection = await vc.join();

    let callback = async (newMsg) => {
        if(newMsg.author !== message.author) return;
        if(newMsg.channel !== message.channel) return;
        if(newMsg.content === "%end") {
            message.channel.send("Ended")
            return client.removeListener('message', callback);
        }

        let text = newMsg.content.replace(/[^\x00-\x7F]/g, '')
        let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`)
        
        connection.play(out.body);
    }

    client.on('message', callback)
}

exports.help = {
    "name": "start",
    "description": "start a tts instance"
}