import { MessageHandler } from '../MessageHandler';
import { isCommand } from '../util';
import { save } from '../save';
import { Reply } from '../messaging';

export default class AcceptHandler extends MessageHandler {
  name = 'Accept';

  async handlesMessage() {
    return isCommand(this.channel, this.msg, 'accept');
  }

  async reply(): Promise<Reply> {
    if (!this.channel?.invites) {
      return this.simpleReply('No active invite to accept.');
    }
    const playerIds = this.channel?.invites.players.map(player => player.id.value);
    if (!playerIds.includes(this.msg.author.id.value)) {
      return this.simpleReply('You are not part of this invite to accept it.');
    }
    const acceptedIds = this.channel?.invites.accepted.map(player => player.id.value);
    if (acceptedIds.includes(this.msg.author.id.value)) {
      return this.simpleReply('This invite was already accepted by you.');
    }
    return this.accept(playerIds, acceptedIds);
  }

  async accept(playerIds: String[], acceptedIds: String[]): Promise<Reply> {
    const remaining = new Set(playerIds).size - new Set(acceptedIds).size;
    if (remaining === 1) {
      return this.startGame();
    } else {
      this.channel?.invites.accepted.push({
        username: this.msg.author.username,
        id: this.msg.author.id,
      });
      save(this.state);
      return this.simpleReply(`Invite accepted, waiting for other ${remaining - 1} player(s) to accept invite.`);
    }
  }

  async startGame(): Promise<Reply> {
    const gameCode = this.channel.invites.gameCode;
    const players = this.channel.invites.players;
    this.channel.invites = undefined;
    this.channel.currentGame = {
      gameCode,
      players,
      creator: players[0],
    };
    save(this.state);
    const playersUsernames = players.map(player => player.username).join(', ');
    return this.simpleReply(`A ${gameCode} match is starting with ${playersUsernames}!`);
  }
}
