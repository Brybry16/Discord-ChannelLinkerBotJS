const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reply',
            memberName: 'reply',
            group: 'msgformat',
            description: 'Sends a message.',
            examples: ['reply']
        });
    }

    run(msg) {
        return msg.say('Hi, it\'s to help you');
    }
};