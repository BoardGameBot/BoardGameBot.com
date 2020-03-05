import { BotHandler } from './bothandler';
import { isCommand, authorizeAdminOnly } from '../util';
import { save } from '../save';

export default class DisableHandler extends BotHandler {
    name = "Disable";

    async handlesMessage() {
        return isCommand(this.channel, this.msg, 'disable');
    }

    async reply() {
        authorizeAdminOnly(this.msg, () => {
            this.channel.enabled = false;
            save(this.state);
            this.send('Done. I am now disabled for this channel.');
        });
    }
}