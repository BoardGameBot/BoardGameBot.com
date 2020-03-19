import { MessageHandler } from '../MessageHandler';
import { MessagingEnvironment } from '../MessagingEnvironment';
import { Bot } from '../state';
import { Message } from '../messaging';
import { Client, GameConfig } from 'boardgame.io/client';
import { GameDef } from '../games';

export class GameHandler extends MessageHandler {
    gameDef: GameDef;
    bgio: Client;

    constructor(state: Bot, msg: Message, env: MessagingEnvironment, gameDef: GameDef) {
        super(state, msg, env);
        this.bgio = Client({ game: gameDef.gameConfig });
    }
}