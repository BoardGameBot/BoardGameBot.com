import { BotHandler } from './bothandler';
import { Message } from 'discord.js';
import { isCommand } from '../util';

export default class HelpHandler extends BotHandler {
    name = "Help";

    handlesMessage() {
        return isCommand(this.msg, 'help');
    }

    reply() {
        this.pvt(`Use ".invite GAME @PLAYER1 @PLAYER2..." to invite players to a match of a game. You can see available games at https://boardgamebot.com/games`);
    }
}