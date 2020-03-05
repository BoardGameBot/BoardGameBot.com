import { BotHandler } from './bothandler';
import { isRawCommand, authorizeAdminOnly } from '../util';
import { save } from '../save';

export default class EnableHandler extends BotHandler {
    name = "Enable";
    async handlesMessage() {
        return isRawCommand(this.msg, 'enable-bgb');
    }

    async reply() {
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
            save(this.state);
            this.send('Done. I am now enabled for this channel.');
        } else {
            this.send('I am already enabled for this channel.');
        }
    }

    public createNewChannel() {
        const channel = { enabled: false };
        this.state.channels[this.msg.channel.id] = channel;
        this.channel = channel;
        save(this.state);
    }
}