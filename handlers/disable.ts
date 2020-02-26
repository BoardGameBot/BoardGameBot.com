import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { isCommand, authorizeAdminOnly, isEnabledInChannel } from '../util';

export default class DisableHandler implements BotHandler {
    name = "Disable";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'disable')) {
            authorizeAdminOnly(msg, () => {
                this.disable(msg);
            });
            return true;
        }
        return false;
    }

    private disable(msg: Message) {
        if (isEnabledInChannel(msg.channel)) {
            msg.channel.send('I am already disabled for this channel.');
        } else {
            botSingleton.channels[msg.channel.id].enabled = false;
            msg.channel.send('Done. I am now disabled for this channel.');
        }
    }
}