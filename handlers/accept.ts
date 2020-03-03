import { BotHandler } from './bothandler';
import { botSingleton } from '../state';
import { Message } from 'discord.js';
import { isCommand } from '../util';
import { save } from '../save';

export default class AcceptHandler extends BotHandler {
    name = "Accept";

    async handlesMessage() {
        return isCommand(this.msg, 'accept');
    }

    async reply() {
        if (!this.channel?.invites) {
            this.send('No active invite to accept.');
            return;
        }
        const playerIds = this.channel?.invites.players.map((player) => player.id);
        if (!playerIds.includes(this.msg.member.id)) {
            this.send('You are not part of this invite to accept it.');
            return;
        }
        const acceptedIds = this.channel?.invites.accepted.map((player) => player.id);
        if (acceptedIds.includes(this.msg.member.id)) {
            this.send('This invite was already accepted by you.');
            return;
        }
        this.accept(playerIds, acceptedIds);
    }

    accept(playerIds: String[], acceptedIds: String[]) {
        const remaining = new Set(playerIds).size - new Set(acceptedIds).size;
        if (remaining === 1) {
            this.startGame();
        } else {
            this.channel?.invites.accepted.push({
                username: this.msg.member.user.username,
                id: this.msg.member.id
            });
            save();
            this.send(`Invite accepted, waiting for other ${remaining - 1} player(s) to accept invite.`);
        }
    }

    startGame() {
        const gameCode = this.channel.invites.gameCode;
        const players = this.channel.invites.players;
        this.channel.invites = undefined;
        this.channel.currentGame = {
            gameCode,
            players,
            creator: players[0],
            state: {} // TODO
        };
        save();
        const playersUsernames = players.map(player => player.username).join(', ');
        this.send(`A ${gameCode} match is starting with ${playersUsernames}!`);
    }
}
