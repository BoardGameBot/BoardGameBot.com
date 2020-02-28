import { BotHandler } from './index';
import { botSingleton, Player, client } from '../state';
import { Message, User } from 'discord.js';
import { isCommand, parseMention, isEnabledInChannel, convertUserToPlayer } from '../util';
import { GAMES_MAP } from '../games';
import { save } from '../save';

export default class InviteHandler implements BotHandler {
    name = "Invite";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'invite')) {
            const args = msg.content.split(' ');
            const gameCode = args[1];
            const usersMentions = args.slice(2, args.length);
            const users: User[] = usersMentions.map((mention) => parseMention(mention)).filter((user) => user != undefined);
            users.unshift(msg.member.user);
            // TODO: check min/max number of users for specific game
            if (this.checkGameInProgress(msg) &&
                this.checkNumberOfArguments(msg, args) &&
                this.checkValidGame(msg, gameCode) &&
                this.checkValidUserSelection(msg, users) &&
                this.checkMinNumberOfUsers(msg, users)) {
                this.start(msg, users, gameCode);
            }
            return true;
        }
        return false;
    }

    private checkGameInProgress(msg: Message): boolean {
        if (botSingleton.channels[msg.channel.id].currentGame) {
            msg.channel.send('There is a game in progress. Wait for it to end in order to start a new one.');
            return false;
        }
        return true;
    }

    private checkNumberOfArguments(msg: Message, args: String[]) {
        if (args.length < 3) {
            msg.channel.send('Not enough arguments. Correct usage: ".start GAME @PLAYER1 @PLAYER2..."');
            return false;
        }
        return true;
    }

    private checkValidGame(msg: Message, gameCode: string) {
        if (!(gameCode in GAMES_MAP)) {
            msg.channel.send('Invalid game. Check https://boardgamebot.com/games to see list of games.');
            return false;
        }
        return true;
    }

    private checkValidUserSelection(msg: Message, users: User[]): boolean {
        const ids = users.map((user) => user.id);
        const idsSet = new Set(ids);
        if (ids.length != idsSet.size) {
            msg.channel.send('Invalid selection of users.');
            return false;
        }
        return true;
    }

    private checkMinNumberOfUsers(msg: Message, users: User[]) {
        if (users.length <= 1) {
            msg.channel.send('Not enough users to play this game!');
            return false;
        }
        return true;
    }

    private start(msg: Message, users: User[], gameCode) {
        const players = users.map((user) => convertUserToPlayer(user));
        const creator = msg.member.user;
        botSingleton.channels[msg.channel.id].invites = {
            players,
            accepted: [convertUserToPlayer(creator)],
            gameCode
        };
        save();
        const invitees = players.filter((player) => player.id !== creator.id)
            .map((invitee) => `<@${invitee.id}>`)
            .join(', ');
        msg.channel.send(
            `${invitees}, do you want to play ${gameCode} with <@${creator.id}> ? Use ".accept" to accept, or ".reject" to reject invite.`);
    }
}