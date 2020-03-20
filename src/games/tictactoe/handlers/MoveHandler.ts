import { GameHandler } from "../../GameHandler";
import { isCommand } from "../../../util";
import { save } from "../../../save";

export default class MoveHandler extends GameHandler {

    async handlesMessage() {
        return isCommand(this.channel, this.msg, 'move');
    }

    async reply() {
        const splitMsg = this.msg.content.split(' ');
        if (!this.isValidCommand(splitMsg)) {
            return this.simpleReply('Invalid command. Usage: .move <<CELL NUMBER>>');
        }
        const index = parseInt(splitMsg[1]);
        if (index === 7) {
            this.game.updatePlayerID('1');
            console.log('aye aye captain');
        }
        this.game.moves.clickCell(index);

        await this.save();
        const state = this.game.getState();
        console.log(JSON.stringify(state));
        return this.simpleReply(JSON.stringify(state.G.cells));
    }

    isValidCommand(splitMsg: string[]) {
        return splitMsg.length === 2 && parseInt(splitMsg[1]) >= 0;
    }
}