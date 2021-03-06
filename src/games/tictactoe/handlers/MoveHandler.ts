import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
import { Mention } from '../../../messaging';
import { BoardRenderer } from '../renderers/BoardRenderer';
import { coordToCell, isValidCoord } from '../util';

export default class MoveHandler extends GameHandler {
  async handlesMessage() {
    return isCommand(this.env, this.channel, this.msg, 'move');
  }

  async reply() {
    const splitMsg = this.msg.content.split(' ');
    if (!this.isValidCommand(splitMsg)) {
      return this.simpleReply(`Invalid command. Usage: ${this.env.prefix}move <<CELL>>`);
    }
    if (!this.isCurrentPlayer()) {
      return this.simpleReply('It is not your turn!');
    }
    const coord = splitMsg[1].toUpperCase();
    const cell = coordToCell(coord);
    if (this.isActiveCell(cell)) {
      this.game.moves.clickCell(cell);
    } else {
      return this.simpleReply('Invalid move!');
    }
    await this.save();
    return this.render(cell);
  }

  async render(lastPlayedCell?: number) {
    const state = this.game.getState();
    const currentPlayer = this.getPlayerFromIndex(state.ctx.currentPlayer);
    let content = `Done. It is @username turn's now! Use: ${this.env.prefix}move <<CELL>>`;
    let mentions: Mention[] = [{ user: currentPlayer, wordIndex: 3 }];
    let winningCells;
    if (state.ctx.gameover && state.ctx.gameover.winner) {
      const winner = this.getPlayerFromIndex(state.ctx.gameover.winner);
      winningCells = state.ctx.gameover.winningCells;
      content = '@username wins!';
      mentions = [{ user: winner, wordIndex: 0 }];
      await this.endGame();
    } else if (state.ctx.gameover && state.ctx.gameover.draw) {
      content = 'It is a draw! Nobody wins.';
      mentions = [];
      await this.endGame();
    }
    const renderer = new BoardRenderer();
    const img = renderer.render(state.G, lastPlayedCell, winningCells);
    return this.replyWithImage(content, img, mentions);
  }

  isValidCommand(splitMsg: string[]) {
    return splitMsg.length === 2 && isValidCoord(splitMsg[1]);
  }

  isActiveCell(id: number) {
    return this.game.getState().G.cells[id] === null;
  }
}
