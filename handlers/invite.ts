import { BotHandler } from './bothandler';
import { botSingleton, Player, client } from '../state';
import { Message, User } from 'discord.js';
import { isCommand, parseMention, isEnabledInChannel, convertUserToPlayer } from '../util';
import { GAMES_MAP } from '../games';
import { save } from '../save';

export default class InviteHandler extends BotHandler {
    name = "Invite";

    handlesMessage() {
        return isCommand(this.msg, 'invite');
    }

    reply() {
        const args = this.msg.content.split(' ');
        const gameCode = args[1];
        const usersMentions = args.slice(2, args.length);
        const users: User[] = usersMentions.map((mention) => parseMention(mention)).filter((user) => user != undefined);
        users.unshift(this.msg.member.user);
        // TODO: check min/max number of users for specific game
        if (this.checkGameInProgress() &&
            this.checkNumberOfArguments(args) &&
            this.checkValidGame(gameCode) &&
            this.checkValidUserSelection(users) &&
            this.checkMinNumberOfUsers(users)) {
            this.start(users, gameCode);
        }
    }

    private checkGameInProgress(): boolean {
        if (this.channel.currentGame) {
            this.send('There is a game in progress. Wait for it to end in order to start a new one.');
            return false;
        }
        return true;
    }

    private checkNumberOfArguments(args: String[]) {
        if (args.length < 3) {
            this.send('Not enough arguments. Correct usage: ".start GAME @PLAYER1 @PLAYER2..."');
            return false;
        }
        return true;
    }

    private checkValidGame(gameCode: string) {
        if (!(gameCode in GAMES_MAP)) {
            this.send('Invalid game. Check https://boardgamebot.com/games to see list of games.');
            return false;
        }
        return true;
    }

    private checkValidUserSelection(users: User[]): boolean {
        const ids = users.map((user) => user.id);
        const idsSet = new Set(ids);
        if (ids.length != idsSet.size) {
            this.send('Invalid selection of users.');
            return false;
        }
        return true;
    }

    private checkMinNumberOfUsers(users: User[]) {
        if (users.length <= 1) {
            this.send('Not enough users to play this game!');
            return false;
        }
        return true;
    }

    private start(users: User[], gameCode) {
        const players = users.map((user) => convertUserToPlayer(user));
        const creator = this.msg.member.user;
        this.channel.invites = {
            players,
            accepted: [convertUserToPlayer(creator)],
            gameCode
        };
        save();
        const invitees = players.filter((player) => player.id !== creator.id)
            .map((invitee) => `<@${invitee.id}>`)
            .join(', ');
        this.send(
            `${invitees}, do you want to play ${gameCode} with <@${creator.id}> ? Use ".accept" to accept, or ".reject" to reject invite.`);
    }
}