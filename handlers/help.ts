import { BotHandler } from './index';
import { Message } from 'discord.js';
import { isCommand } from '../util';

export default class HelpHandler implements BotHandler {
    name = "Help";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'help')) {
            msg.author.send(`Use ".invite GAME @PLAYER1 @PLAYER2..." to invite players to a match of a game. You can see available games at https://boardgamebot.com/games`)
            return true;
        }
        return false;
    }
}