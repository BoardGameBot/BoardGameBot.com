import { MessageHandler } from '../MessageHandler';
import { isRawCommand, simpleReply } from '../util';
import { save } from '../save';
import { ChannelType, Reply } from '../messaging';

export default class EnableHandler extends MessageHandler {
    name = "Enable";
    async handlesMessage() {
        return this.msg.channel.type === ChannelType.PUBLIC_GROUP &&
            isRawCommand(this.msg, 'enable-bgb');
    }

    async reply(): Promise<Reply> {
        if (!(await this.env.isAdmin(this.msg.author, this.msg.channel))) {
            return this.simpleReply('Sorry, you need to be a server admin/owner to do that.');
        }
        return this.enable();
    };

    private async enable(): Promise<Reply> {
        if (!this.channel) {
            this.createNewChannel();
        }
        if (!this.channel.enabled) {
            this.channel.enabled = true;
            save(this.state);
            return this.simpleReply('Done. I am now enabled for this channel.');
        } else {
            return this.simpleReply('I am already enabled for this channel.');
        }
    }

    public createNewChannel() {
        const channel = { enabled: false };
        this.state.channels[this.msg.channel.id.value] = channel;
        this.channel = channel;
        save(this.state);
    }
}