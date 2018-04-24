const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/linkedChannels.json';
const guildsList = require(fileName);

module.exports = class CreateLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createlink',
            aliases: ['cl', 'create'],
            memberName: 'createlink',
            group: 'link',
            description: 'adds a link to the guild',
            examples: ['createlink #from #to', 'createlink from to'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    key: 'from',
                    prompt: 'From which channel do you want to copy the messages ?',
                    type: 'channel'
                },
                {
                    key: 'to',
                    prompt: 'To which channel do you want to copy the messages ?',
                    type: 'channel'
                }
            ]
        });
    }

    run(msg, { from, to }) {

        if(from.id === to.id) {
            return msg.say('Unable to create a link between only one channel');
        }

        const guildId = msg.guild.id;

        // No link
        if(!guildsList['guilds'].hasOwnProperty(guildId)) {
            guildsList['guilds'][guildId] = {};
        }

        // Guild already have link(s)
        if(!guildsList['guilds'][guildId].hasOwnProperty(from.id)) {
            guildsList['guilds'][guildId][from.id] = [];
        }

        // Link is duplicate
        if(guildsList['guilds'][guildId][from.id].indexOf(to.id) !== -1) {
            return msg.say('The link you are attempting to create already exists');
        }

        guildsList['guilds'][guildId][from.id].push(to.id);

        // Updating JSON file
        fs.writeFile('./settings/linkedChannels.json', JSON.stringify(guildsList, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            // console.log(JSON.stringify(guildsList, null, 2));
        });

        // this.client.emit('linkChange', guildsList);

        return msg.say('Link created.');
    }
};