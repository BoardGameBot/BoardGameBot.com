import EnableHandler from './EnableHandler';
import DisableHandler from './DisableHandler';
import InviteHandler from './InviteHandler';
import HelpHandler from './HelpHandler';
import RejectHandler from './RejectHandler';
import AcceptHandler from './AcceptHandler';
import { Message } from '../messaging';
import { MessageHandler } from '../MessageHandler';
import { Bot } from '../state';
import { MessagingEnvironment } from '../MessagingEnvironment';

const handlers: (state: Bot, msg: Message, env: MessagingEnvironment) => MessageHandler[] = (state, msg, env) => [
    new EnableHandler(state, msg, env),
    new DisableHandler(state, msg, env),
    new InviteHandler(state, msg, env),
    new HelpHandler(state, msg, env),
    new RejectHandler(state, msg, env),
    new AcceptHandler(state, msg, env),
];

export default handlers;