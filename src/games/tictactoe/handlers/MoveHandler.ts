import { GameHandler } from '../../GameHandler';
import { isCommand } from '../../../util';
import { save } from '../../../save';

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
        this.game.moves.clickCell(index);

        await this.save();
        const state = this.game.getState();
        return this.simpleReply(JSON.stringify(state.G.cells));
    }

    isValidCommand(splitMsg: string[]) {
        return splitMsg.length === 2 && parseInt(splitMsg[1]) >= 0;
    }
}
