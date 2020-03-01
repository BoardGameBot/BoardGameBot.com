import { BotHandler } from './bothandler';
import { botSingleton, client } from '../state';
import { Message, Channel } from 'discord.js';
import { isCommand, authorizeAdminOnly, isEnabledInChannel } from '../util';
import { rejects } from 'assert';
import { save } from '../save';

export default class RejectHandler extends BotHandler {
    name = "Reject";
    handlesMessage() {
        return isCommand(this.msg, 'reject');
    }

    reply() {
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
        save();
        this.send('Invite rejected.');
    }
}