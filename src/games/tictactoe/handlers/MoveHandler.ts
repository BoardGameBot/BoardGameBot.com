import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
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
    return this.renderBoard(cell);
  }

  renderBoard(lastPlayedCell?: number) {
    const state = this.game.getState();
    const renderer = new BoardRenderer();
    const img = renderer.render(state.G, lastPlayedCell);
    return this.replyWithImage(JSON.stringify(state.G.cells), img);
  }

  isValidCommand(splitMsg: string[]) {
    return splitMsg.length === 2 && isValidCoord(splitMsg[1]);
  }
}
