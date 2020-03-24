import { MessageHandler } from '../MessageHandler';
import { MessagingEnvironment } from '../MessagingEnvironment';
import { Bot, Player } from '../state';
import { Message } from '../messaging';
import { Client } from 'boardgame.io/client';
import { GameDef } from '../games';
import { save } from '../save';
import { equalId } from '../util';

export class GameHandler extends MessageHandler {
  gameDef: GameDef;
  game: Client;

  constructor(state: Bot, msg: Message, env: MessagingEnvironment, gameDef: GameDef) {
    super(state, msg, env);
    this.game = Client({ game: gameDef.gameConfig });
    const gameState = this.channel.currentGame.state;
    if (gameState) {
      const action = {
        type: 'SYNC',
        state: gameState,
        log: [],
        clientOnly: true,
      };
      this.game.store.dispatch(action);
    }
  }

  isCurrentPlayer(): boolean {
    const currentPlayer = this.getPlayerFromIndex(this.game.getState().ctx.currentPlayer);
    return equalId(currentPlayer.id, this.msg.author.id);
  }

  getPlayerFromIndex(index: string): Player {
    const players = this.channel.currentGame.players;
    return players[parseInt(index)];
  }

  async save() {
    const gameState = this.game.store.getState();
    this.channel.currentGame.state = gameState;
    await save(this.state);
  }

  async endGame() {
    delete this.channel.currentGame;
    await save(this.state);
  }
}
