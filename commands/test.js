exports.run = (client, message, args) => {
    return message.channel.send("test");
}

exports.help = {
    "name": "test",
    "description": "test command"
}