import { MessageHandler } from '../MessageHandler';
import { isCommand } from '../util';
import { save } from '../save';
import { Reply } from '../messaging';

export default class DisableHandler extends MessageHandler {
  name = 'Disable';

  async handlesMessage() {
    return isCommand(this.channel, this.msg, 'disable');
  }

  async reply(): Promise<Reply> {
    if (!(await this.env.isAdmin(this.msg.author, this.msg.channel))) {
      return this.simpleReply('Sorry, you need to be a server admin/owner to do that.');
    }
    this.channel.enabled = false;
    await save(this.state);
    return this.simpleReply('Done. I am now disabled for this channel.');
  }
}
