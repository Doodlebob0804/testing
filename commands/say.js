const fetch = require('node-fetch')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');

    let connection = await vc.join();

    let text = args.join(" ").replace(/[^\x00-\x7F]/g, '')
    let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`)

    connection.play(out.body);
}

exports.help = {
    "name": "say",
    "description": "read text in a vc"
}