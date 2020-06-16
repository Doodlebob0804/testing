const text2wav = require('text2wav')
let { Duplex } = require('stream');

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    
    let connection = await vc.join();
    let out = await text2wav(args.join(" "))
    let buffer = new Buffer.from(out);
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    
    connection.play(stream);
}

exports.help = {
    "name": "play",
    "description": "read text in a vc"
}