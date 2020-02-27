import EnableHandler from './enable';
import DisableHandler from './disable';
import { Message } from 'discord.js';
import StartHandler from './start';

export interface BotHandler {
    name: string;
    // Executed when a message is sent. Returns true if command was handled. 
    onMessage: (msg: Message) => boolean;
};

export default [
    new EnableHandler(),
    new DisableHandler(),
    new StartHandler()
];