import { MessageHandler } from '../MessageHandler';
import { isCommand } from '../util';
import { Reply } from '../messaging';

export default class HelpHandler extends MessageHandler {
    name = "Help";

    async handlesMessage() {
        return isCommand(this.channel, this.msg, 'help');
    }

    async reply(): Promise<Reply> {
        return this.pvtReply(
            `Use ".invite GAME @PLAYER1 @PLAYER2..." to invite players to a match of a game.` +
            `You can see available games at https://boardgamebot.com/games`
        );
    }
}