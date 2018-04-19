const { Command } = require('discord.js-commando');
const { guilds } = require('../../linkedChannels.json');

module.exports = class ShowLinksCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'showlinks',
            aliases: ['sl'],
            memberName: 'showlinks',
            group: 'link',
            description: 'Show all the links',
            examples: ['showlinks']
        });
    }

    run(msg) {
        const guildId = msg.guild.id;

        // No link
        if(!guilds.hasOwnProperty(guildId)) {
            return msg.say('This server has no link.');
        }

        let links = '**This server links are:**';

        // Gets all channels and add them to the message
        Object.keys(guilds[guildId]).forEach(function(k) {
            Object.keys(guilds[guildId][k]).forEach(function(c) {
                links += '\n<#' + k + '> **=>** <#' + guilds[guildId][k][c] + '>';
            });
        });

        return msg.say(links);
    }
};