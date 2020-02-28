import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { isRawCommand, authorizeAdminOnly } from '../util';
import { save } from '../save';

export default class EnableHandler implements BotHandler {
    name = "Enable";
    onMessage(msg: Message): boolean {
        if (isRawCommand(msg, 'enable-bgb')) {
            authorizeAdminOnly(msg, () => {
                this.enable(msg);
            });
            return true;
        }
        return false;
    };

    private enable(msg: Message) {
        let channel = botSingleton.channels[msg.channel.id];
        if (!channel) {
            channel = { enabled: false };
            botSingleton.channels[msg.channel.id] = channel;
        }
        if (!channel.enabled) {
            botSingleton.channels[msg.channel.id].enabled = true;
            save();
            msg.channel.send('Done. I am now enabled for this channel.');
        } else {
            msg.channel.send('I am already enabled for this channel.');
        }
    }
}