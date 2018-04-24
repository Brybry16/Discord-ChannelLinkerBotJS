const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/format.json';
const formats = require(fileName);

module.exports = class CreateLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'format',
            aliases: ['form'],
            memberName: 'format',
            group: 'msgformat',
            description: 'Sets default message format in which the message will be sent. Format modifiers are **\\u** (User tag), **\\t** (Time in HH:MM forat), **\\c** (Channel) and **\\m** (Message, _at the end by default)_. ',
            examples: ['mi!format [\\t] \\c <\\*\\*\\u\\*\\*> gives [16:00] #channel <**Brybry#0001**> hello world'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    key: 'format',
                    prompt: 'Format in which the message will be sent.\n**\\u:** User\n**\\t:** Time\n**\\c:** Channel\n**\\m:** Message _(At the end by default)_',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    run(msg, { format }) {

        const guildId = msg.guild.id;

        if(!format || format === '\\m') {
            if(formats.hasOwnProperty(guildId)) {
                delete formats[guildId];
            }
        }
        else {
            formats[guildId] = format.includes('\\m') ? format : format + ' \\m';
        }

        // Updating JSON file
        fs.writeFile('./settings/format.json', JSON.stringify(formats, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            // console.log(JSON.stringify(formats, null, 2));
        });

        return msg.say('Format updated.');
    }
};