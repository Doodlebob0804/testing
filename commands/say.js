const fetch = require('node-fetch')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    if(!args[0]) return message.channel.send('Please provide something to say.')

    let connection = await vc.join();

    let text = args.join(" ").replace(/[^\x00-\x7F]/g, '')
    text = text.replace(/[%#]/g, '');
    text = text.replace(/&/g, 'and')
    text = text.replace(/(<a?:)(.+?)(:[0-9]+>)/g, `$2`)
    let out = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`)

    connection.play(out.body);
}

exports.help = {
    "name": "say",
    "description": "read text in a vc"
}