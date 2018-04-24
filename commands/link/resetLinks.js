const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/linkedChannels.json';
const guildsList = require(fileName);

module.exports = class ResetLinksCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resetlinks',
            aliases: ['reset'],
            memberName: 'resetlinks',
            group: 'link',
            description: 'delete all the links in the guild',
            examples: ['resetlinks'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD']
        });
    }

    run(msg) {

        const guildId = msg.guild.id;

        // No link
        if(!guildsList['guilds'].hasOwnProperty(guildId)) {
            return msg.say('This server has no link.');
        }

        delete guildsList['guilds'][guildId];

        // Updating JSON file
        fs.writeFile('./settings/linkedChannels.json', JSON.stringify(guildsList, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            // console.log(JSON.stringify(guildsList, null, 2));
        });

        return msg.say('Links reseted.');
    }
};