import { MessageHandler } from '../MessageHandler';
import { MessagingEnvironment } from '../MessagingEnvironment';
import { Bot } from '../state';
import { Message } from '../messaging';
import { Client, GameConfig } from 'boardgame.io/client';
import { GameDef } from '../games';
import { save } from '../save';

export class GameHandler extends MessageHandler {
    gameDef: GameDef;
    game: Client;

    constructor(state: Bot, msg: Message, env: MessagingEnvironment, gameDef: GameDef) {
        super(state, msg, env);
        this.game = Client({ game: gameDef.gameConfig });
        const previousState = this.channel.currentGame.state;
        if (previousState) {
            this.game.overrideGameState(previousState);
        }
    }

    async save() {
        this.channel.currentGame.state = this.game.store.getState();
        await save(this.state);
    }
}
