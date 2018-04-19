const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix, token, owner } = require('./config.json');
const links = require('./linkedChannels.json');

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

// Copie les messages sur les channels linkés
client.on('message', msg => {
    try {
        // Ne copie pas si le bot a écrit le message ou si le serveur n'a pas de lien
        if((msg.content.length === 0 && msg.attachments.size === 0)
        || msg.author.id === client.user.id
        || !links.guilds.hasOwnProperty(msg.guild.id)) {
            return;
        }

        const to = links.guilds[msg.guild.id][msg.channel.id];

        // Ne copie pas si le canal n'a pas de lien
        if(typeof to === 'undefined') {
            return;
        }

        // Copie des messages
        to.forEach(id => {
            const channel = client.channels.get(id);
            if(channel.type === 'text') {

                // Envoi de message avec pièce jointe
                if(msg.attachments.size > 0) {
                    msg.attachments.forEach((MA) => {
                        let txt = '';
                        switch(msg.content.length) {
                            default:
                                txt = msg.content + '\n\n';
                            case 0:
                                txt += 'Attachment:';
                        }
                        channel.send(txt, {
                            files:
                                [MA.url]
                            });
                    });
                }

                // Envoi de message sans pièce jointe
                else {
                    channel.send(msg.content);
                }
            }
        });
    }
    catch(err) {
        console.log(err);
    }
});

client.login(token);