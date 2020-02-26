import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { mentionedBotAndCommand, authorizeAdminOnly } from '../util';

export default class EnableHandler implements BotHandler {
    name = "Enable";
    init() {
        client.on('message', msg => {
            if (mentionedBotAndCommand(msg, 'enable')) {
                authorizeAdminOnly(msg, () => {
                    this.enable(msg);
                });
            }
        });
    };

    private enable(msg: Message) {
        let channel = botSingleton.channels[msg.channel.id];
        if (!channel) {
            channel = { enabled: false };
            botSingleton.channels[msg.channel.id] = channel;
        }
        if (!channel.enabled) {
            botSingleton.channels[msg.channel.id].enabled = true;
            msg.reply('Done. I am now enabled for this channel. Use ".help" to see all available commands.');
        } else {
            msg.reply('I am already enabled for this channel. If you want to disable me, use ".disable".');
        }
    }
}