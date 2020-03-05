import EnableHandler from './enable';
import DisableHandler from './disable';
import InviteHandler from './invite';
import HelpHandler from './help';
import RejectHandler from './reject';
import AcceptHandler from './accept';
import { Message } from 'discord.js';
import { BotHandler } from './bothandler';
import { Bot } from '../state';

const handlers: (state: Bot, msg: Message) => BotHandler[] = (state, msg) => [
    new EnableHandler(state, msg),
    new DisableHandler(state, msg),
    new InviteHandler(state, msg),
    new HelpHandler(state, msg),
    new RejectHandler(state, msg),
    new AcceptHandler(state, msg),
];

export default handlers;