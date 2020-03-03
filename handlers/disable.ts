import { BotHandler } from './bothandler';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { isCommand, authorizeAdminOnly, isEnabledInChannel } from '../util';
import { save } from '../save';

export default class DisableHandler extends BotHandler {
    name = "Disable";

    async handlesMessage() {
        return isCommand(this.msg, 'disable');
    }

    async reply() {
        authorizeAdminOnly(this.msg, () => {
            this.channel.enabled = false;
            save();
            this.send('Done. I am now disabled for this channel.');
        });
    }
}