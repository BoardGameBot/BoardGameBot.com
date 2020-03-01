import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message, Channel } from 'discord.js';
import { isCommand, authorizeAdminOnly, isEnabledInChannel } from '../util';
import { rejects } from 'assert';
import { save } from '../save';

export default class RejectHandler implements BotHandler {
    name = "Reject";
    onMessage(msg: Message): boolean {
        if (isCommand(msg, 'reject')) {
            const channel = botSingleton.channels[msg.channel.id];
            if (!channel.invites) {
                msg.channel.send('No active invite to reject.');
                return true;
            }
            const playerIds = channel.invites.players.map((player) => player.id);
            if (!playerIds.includes(msg.member.id)) {
                msg.channel.send('You are not part of this invite to reject it.');
                return true;
            }
            this.reject(msg);
            return true;
        }
        return false;
    }

    reject(msg: Message) {
        botSingleton.channels[msg.channel.id].invites = undefined;
        save();
        msg.channel.send('Invite rejected.');
    }
}