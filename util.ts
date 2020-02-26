import { Message, Channel } from 'discord.js';
import { botSingleton, client } from './state';

export const PREFIX = '.';

export function authorizeAdminOnly(msg: Message, callback: () => void) {
    if (msg.member.hasPermission('KICK_MEMBERS', true, true)) {
        callback();
    } else {
        msg.channel.send('Sorry, you need to be a server admin/owner to do that.');
    }
}

export function isEnabledInChannel(channel: Channel) {
    return channel.id in botSingleton.channels && botSingleton.channels[channel.id].enabled;
}

export function isRawCommand(msg: Message, cmd: string): boolean {
    return msg.content.toLowerCase().startsWith(PREFIX + cmd);
}

export function isCommand(msg: Message, cmd: string): boolean {
    if (isEnabledInChannel(msg.channel) && isRawCommand(msg, cmd)) {
        return true;
    }
}

export function isAnyCommand(msg: Message) {
    return isCommand(msg, '');
}