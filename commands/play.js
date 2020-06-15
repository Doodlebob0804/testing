var txt = require("text-to-mp3");
let { Duplex } = require('stream');

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    
    let connection = await vc.join();
    let buffer = await txt.getMp3(args.join(" "));
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    
    connection.play(stream);
}

exports.help = {
    "name": "play",
    "description": "read text in a vc"
}