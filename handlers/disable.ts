import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { mentionedBotAndCommand, authorizeAdminOnly } from '../util';

export default class DisableHandler implements BotHandler {
    name = "Disable";
    init() {
        client.on('message', msg => {
            if (mentionedBotAndCommand(msg, 'disable')) {
                authorizeAdminOnly(msg, () => {
                    this.disable(msg);
                });
            }
        });
    }

    private disable(msg: Message) {
        let channel = botSingleton.channels[msg.channel.id];
        if (!channel || !channel.enabled) {
            msg.reply('I am already disabled for this channel. If you want to enable me, use ".enable".');
        } else {
            botSingleton.channels[msg.channel.id].enabled = false;
            msg.reply('Done. I am now disabled for this channel. Use ".help" to see all available commands.');
        }
    }
}