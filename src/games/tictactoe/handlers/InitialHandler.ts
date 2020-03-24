import { GameHandler } from '../../GameHandler';
import { Mention } from '../../../messaging';
import { BoardRenderer } from '../renderers/BoardRenderer';

export default class InitialHandler extends GameHandler {
  async reply() {
    const state = this.game.getState();
    const currentPlayer = this.getPlayerFromIndex(state.ctx.currentPlayer);
    const content =
      "Tic-Tac-Toe is starting! @username -- it is your turn. Reply '.move <<CELL>>' for selecting a cell, i.e., '.move B2'.";
    const mention: Mention = {
      user: currentPlayer,
      wordIndex: 3,
    };
    const renderer = new BoardRenderer();
    const img = renderer.render(state.G);
    return this.replyWithImage(content, img, [mention]);
  }
}
