import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
import { TictactoeGameState } from '../game';
import { BoardRenderer } from '../renderers/BoardRenderer';

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
        return this.renderBoard();
    }

    renderBoard() {
        const state = this.game.getState();
        const renderer = new BoardRenderer();
        const img = renderer.render(state.G);
        return this.replyWithImage(JSON.stringify(state.G.cells), img);
    }



    isValidCommand(splitMsg: string[]) {
        return splitMsg.length === 2 && parseInt(splitMsg[1]) >= 0;
    }
}
