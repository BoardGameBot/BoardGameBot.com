import { MessageHandler } from '../MessageHandler';
import { isCommand } from '../util';
import { save } from '../save';
import { ChannelType, Reply } from '../messaging';

export default class RejectHandler extends MessageHandler {
  name = 'Reject';
  async handlesMessage() {
    return this.msg.channel.type === ChannelType.PUBLIC_GROUP && isCommand(this.channel, this.msg, 'reject');
  }

  async reply(): Promise<Reply> {
    if (!this.channel.invites) {
      return this.simpleReply('No active invite to reject.');
    }
    const playerIds = this.channel.invites.players.map(player => player.id.value);
    if (!playerIds.includes(this.msg.author.id.value)) {
      return this.simpleReply('You are not part of this invite to reject it.');
    }
    return this.reject();
  }

  reject() {
    this.channel.invites = undefined;
    save(this.state);
    return this.simpleReply('Invite rejected.');
  }
}
