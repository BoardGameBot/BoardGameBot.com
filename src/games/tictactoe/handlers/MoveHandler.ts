import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
import { Mention } from '../../../messaging';
import { TictactoeGameState } from '../game';
import { BoardRenderer } from '../renderers/BoardRenderer';
import { coordToCell, isValidCoord } from '../util';

export default class MoveHandler extends GameHandler {
  async handlesMessage() {
    return isCommand(this.channel, this.msg, 'move');
  }

  async reply() {
    const splitMsg = this.msg.content.split(' ');
    if (!this.isValidCommand(splitMsg)) {
      return this.simpleReply('Invalid command. Usage: .move <<CELL NUMBER>>');
    }
    if (!this.isCurrentPlayer()) {
      return this.simpleReply('It is not your turn!');
    }
    const coord = splitMsg[1].toUpperCase();
    const cell = coordToCell(coord);
    const state = this.game.getState();
    const cells = state.G.cells;
    if (cell < 0 || cell >= cells.length || cells[cell] !== null) {
      return this.simpleReply('Invalid cell!');
    }
    this.game.moves.clickCell(cell);
    await this.save();
    return this.render(cell);
  }

  async render(lastPlayedCell?: number) {
    const state = this.game.getState();
    const currentPlayer = this.getPlayerFromIndex(state.ctx.currentPlayer);
    let content = "Done. It is @username turn's now! Use: .move <<CELL>>";
    let mentions: Mention[] = [{ user: currentPlayer, wordIndex: 3 }];
    if (state.ctx.gameover && state.ctx.gameover.winner) {
      const winner = this.getPlayerFromIndex(state.ctx.gameover.winner);
      content = "@username wins!"
      mentions = [{ user: winner, wordIndex: 0 }];
      await this.endGame();
    } else if (state.ctx.gameover && state.ctx.gameover.draw) {
      content = "It is a draw! Nobody wins."
      mentions = [];
      await this.endGame();
    }
    const renderer = new BoardRenderer();
    const img = renderer.render(state.G, lastPlayedCell);
    return this.replyWithImage(content, img, mentions);
  }

  isValidCommand(splitMsg: string[]) {
    return splitMsg.length === 2 && isValidCoord(splitMsg[1]);
  }
}
