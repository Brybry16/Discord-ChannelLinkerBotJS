const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/linkedChannels.json';
const guildsList = require(fileName);

module.exports = class DeleteLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deletelink',
            aliases: ['removelink', 'dl', 'rl'],
            memberName: 'deletelink',
            group: 'link',
            description: 'delete a links in the guild',
            examples: ['deletelink'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    key: 'from',
                    prompt: 'From which channel the messages are being copied ?',
                    type: 'channel'
                },
                {
                    key: 'to',
                    prompt: 'To which channel the messages are being copied ?',
                    type: 'channel'
                }
            ]
        });
    }

    run(msg, { from, to }) {

        const guildId = msg.guild.id;

        // No link
        if(!guildsList['guilds'].hasOwnProperty(guildId)) {
            return msg.say('This server has no link.');
        }

        // Guild doesn't have this 'FROM' link
        if(!guildsList['guilds'][guildId].hasOwnProperty(from.id)) {
            return msg.say('Link not found.');
        }

        const toIndex = guildsList['guilds'][guildId][from.id].indexOf(to.id);
        
        // 'FROM' channel is not linked to 'TO' channel in this Guild
        if(toIndex == -1) {
            return msg.say('Link not found.');
        }

        // Removing link
        if(guildsList['guilds'][guildId][from.id].length == 1) {
            // Last link for 'TO' channel => removing entire element
            delete guildsList['guilds'][guildId][from.id];
        }
        else {
            guildsList['guilds'][guildId][from.id].splice(toIndex, 1);
        }

        // Updating JSON file
        fs.writeFile('./settings/linkedChannels.json', JSON.stringify(guildsList, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            // console.log(JSON.stringify(guildsList, null, 2));
        });

        return msg.say('Link deleted.');
    }
};