import EnableHandler from './enable';
import DisableHandler from './disable';
import InviteHandler from './invite';
import HelpHandler from './help';
import RejectHandler from './reject';
import AcceptHandler from './accept';
import { Message } from 'discord.js';
import { BotHandler } from './bothandler';

const handlers: (msg: Message) => BotHandler[] = (msg: Message) => [
    new EnableHandler(msg),
    new DisableHandler(msg),
    new InviteHandler(msg),
    new HelpHandler(msg),
    new RejectHandler(msg),
    new AcceptHandler(msg),
];

export default handlers;