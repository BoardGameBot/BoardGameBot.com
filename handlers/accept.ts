import { BotHandler } from './index';
import { botSingleton } from '../state';
import { Message } from 'discord.js';
import { isCommand } from '../util';
import { save } from '../save';

export default class AcceptHandler implements BotHandler {
    name = "Accept";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'accept')) {
            const channel = botSingleton.channels[msg.channel.id];
            if (!channel.invites) {
                msg.channel.send('No active invite to accept.');
                return true;
            }
            const playerIds = channel.invites.players.map((player) => player.id);
            if (!playerIds.includes(msg.member.id)) {
                msg.channel.send('You are not part of this invite to accept it.');
                return true;
            }
            const acceptedIds = channel.invites.accepted.map((player) => player.id);
            if (acceptedIds.includes(msg.member.id)) {
                msg.channel.send('This invite was already accepted by you.');
                return true;
            }
            this.accept(msg, playerIds, acceptedIds);
            return true;
        }
        return false;
    }

    accept(msg: Message, playerIds: String[], acceptedIds: String[]) {
        const remaining = new Set(playerIds).size - new Set(acceptedIds).size;
        if (remaining === 1) {
            this.startGame(msg);
        } else {
            botSingleton.channels[msg.channel.id].invites.accepted.push({
                username: msg.member.user.username,
                id: msg.member.id
            });
            save();
            msg.channel.send(`Invite accepted, waiting for other ${remaining - 1} player(s) to accept invite.`);
        }
    }

    startGame(msg: Message) {
        const channel = botSingleton.channels[msg.channel.id];
        const gameCode = channel.invites.gameCode;
        const players = channel.invites.players;
        channel.invites = undefined;
        channel.currentGame = {
            gameCode,
            players,
            creator: players[0],
            state: {} // TODO
        };
        save();
        const playersUsernames = players.map(player => player.username).join(', ');
        msg.channel.send(`A ${gameCode} match is starting with ${playersUsernames}!`);
    }
}
