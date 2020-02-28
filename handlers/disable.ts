import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { isCommand, authorizeAdminOnly, isEnabledInChannel } from '../util';
import { save } from '../save';

export default class DisableHandler implements BotHandler {
    name = "Disable";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'disable')) {
            authorizeAdminOnly(msg, () => {
                botSingleton.channels[msg.channel.id].enabled = false;
                save();
                msg.channel.send('Done. I am now disabled for this channel.');
            });
            return true;
        }
        return false;
    }
}