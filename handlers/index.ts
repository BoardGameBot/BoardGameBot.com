import EnableHandler from './enable';
import DisableHandler from './disable';
import InviteHandler from './invite';
import HelpHandler from './help';
import RejectHandler from './reject';
import AcceptHandler from './accept';
import { Message } from 'discord.js';

export interface BotHandler {
    name: string;
    // Executed when a message is sent. Returns true if command was handled. 
    onMessage: (msg: Message) => boolean;
};

export default [
    new EnableHandler(),
    new DisableHandler(),
    new InviteHandler(),
    new HelpHandler(),
    new RejectHandler(),
    new AcceptHandler(),
];
