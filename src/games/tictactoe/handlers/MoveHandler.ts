import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
import { save } from '../../../save';
import { createCanvas } from 'canvas';
import rough from 'roughjs';

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
    const index = parseInt(splitMsg[1]);
    const state = this.game.getState();
    const cells = state.G.cells;
    if (index < 0 || index >= cells.length || cells[index] !== null) {
      return this.simpleReply('Invalid cell!');
    }
    this.game.moves.clickCell(index);

    await this.save();

    const board = this.game.getState().G.cells;
    const img = this.getBoardImg(board);

    return this.simpleReply(JSON.stringify(this.game.getState().G.cells), img);
  }

  getBoardImg(cells: any) {
    const canvas = createCanvas(300, 300);

    const rc = rough.canvas(canvas as any);

    // initial lines for board
    rc.line(100, 0, 100, 300, {strokeWidth: 2});
    rc.line(200, 0, 200, 300, {strokeWidth: 2});
    rc.line(0, 100, 300, 100, {strokeWidth: 2});
    rc.line(0, 200, 300, 200, {strokeWidth: 2});
    rc.line(0, 100, 300, 100, {strokeWidth: 2});

    // fill in cells
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const id = 3 * i + j;
        if (cells[id] === '0') {
          // cross
          rc.line(i * 100, j * 100, (i + 1) * 100, (j + 1) * 100, { stroke: 'red', strokeWidth: 3 });
          rc.line(i * 100, (j + 1) * 100, (i + 1) * 100, j * 100, { stroke: 'red', strokeWidth: 3 });
        } else if (cells[id] === '1') {
          // circle
          rc.circle((i + 0.5) * 100, (j + 0.5) * 100, 75, { stroke: 'green', strokeWidth: 5 });
        }
      }
    }
    const buf = canvas.toBuffer();
    return buf;
  }

  isValidCommand(splitMsg: string[]) {
    return splitMsg.length === 2 && parseInt(splitMsg[1]) >= 0;
  }
}
