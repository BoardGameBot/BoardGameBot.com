import { GameHandler } from "../../GameHandler";
import { isCommand } from "../../../util";
export default class MoveHandler extends GameHandler {

    async handlesMessage() {
        return isCommand(this.channel, this.msg, 'move');
    }

    async reply() {
        return this.simpleReply('test');
    }
}