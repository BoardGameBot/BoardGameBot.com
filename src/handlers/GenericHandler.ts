import { MessageHandler } from '../MessageHandler';
import { GAMES_MAP } from '../games';
import { Message } from '../messaging';
import { MessagingEnvironment } from '../MessagingEnvironment';
import { Bot } from '../state';
import { GameHandler } from '../games/GameHandler';

export default class GenericGameHandler extends MessageHandler {
    name = "GenericGameHandler";
    gameHandlers:GameHandler[] = [];
    
    constructor(state: Bot, msg: Message, env: MessagingEnvironment) {
        super(state, msg, env);
        if (this.channel.currentGame && this.channel.currentGame.gameCode in GAMES_MAP) {
            const gameDef = GAMES_MAP[this.channel.currentGame.gameCode];
            this.gameHandlers = gameDef.handlers.map((handler) => new handler(state, msg, env, gameDef));
        }
    }

    async handlesMessage() {
        for (const gameHandler of this.gameHandlers) {
             if (await gameHandler.handlesMessage()) {
                 return true;
             }
        }
        return false;
    }

    async reply() {
        for (const gameHandler of this.gameHandlers) {
            if (await gameHandler.handlesMessage()) {
                return gameHandler.reply();
            }
        }
        return { messages: [] };
    }
}