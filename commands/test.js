exports.run = async (client, message, args) => {
    console.log(client.currUsers);
}

exports.help = {
    "name": "test",
    "description": "test command"
}