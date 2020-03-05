import { BotHandler } from './bothandler';
import { isCommand } from '../util';
import { save } from '../save';

export default class RejectHandler extends BotHandler {
    name = "Reject";
    async handlesMessage() {
        return isCommand(this.channel, this.msg, 'reject');
    }

    async reply() {
        if (!this.channel.invites) {
            this.send('No active invite to reject.');
            return;
        }
        const playerIds = this.channel.invites.players.map((player) => player.id);
        if (!playerIds.includes(this.msg.member.id)) {
            this.send('You are not part of this invite to reject it.');
            return;
        }
        this.reject();
    }

    reject() {
        this.channel.invites = undefined;
        save(this.state);
        this.send('Invite rejected.');
    }
}