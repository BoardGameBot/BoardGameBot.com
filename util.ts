import { Message } from 'discord.js';
import { client } from './state';

export function mentionedBotAndCommand(msg: Message, cmd: string): boolean {
    return msg.isMentioned(client.user) && msg.content.toLowerCase().includes('.' + cmd);
}

export function authorizeAdminOnly(msg: Message, callback: () => void) {
    if (msg.member.hasPermission('KICK_MEMBERS', true, true)) {
        callback();
    } else {
        msg.reply('Sorry, you need to be a server admin/owner to do that.');
    }
}