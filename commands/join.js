var audio = require("text-to-mp3");
var ytdl = require('ytdl-core')
var fs = require('fs')

exports.run = async (client, message, args) => {
    let vc = message.member.voice.channel;
    if(!vc) return message.channel.send('You must be in a voice channel to use this command.');
    
    let connection = await vc.join();
    const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { filter: 'audioonly' }))
}

exports.help = {
    "name": "join",
    "description": "join a vc"
}