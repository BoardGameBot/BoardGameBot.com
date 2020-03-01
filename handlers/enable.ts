import { BotHandler } from './bothandler';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';
import { isRawCommand, authorizeAdminOnly } from '../util';
import { save } from '../save';

export default class EnableHandler extends BotHandler {
    name = "Enable";
    handlesMessage() {
        return isRawCommand(this.msg, 'enable-bgb');
    }

    reply() {
        authorizeAdminOnly(this.msg, () => {
            this.enable();
        });
    };

    private enable() {
        if (!this.channel) {
            this.createNewChannel();
        }
        if (!this.channel.enabled) {
            this.channel.enabled = true;
            save();
            this.send('Done. I am now enabled for this channel.');
        } else {
            this.send('I am already enabled for this channel.');
        }
    }

    public createNewChannel() {
        const channel = { enabled: false };
        botSingleton.channels[this.msg.channel.id] = channel;
        this.channel = channel;
        save();
    }
}