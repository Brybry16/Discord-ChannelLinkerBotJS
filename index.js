const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix, token, owner } = require('./config.json');

const client = new CommandoClient({
    commandPrefix: prefix,
    owner: owner,
    disableEveryone: true
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['link', 'Channel links'],
        ['msgformat', 'Message formatting']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('Watching you');
});

client.login(token);