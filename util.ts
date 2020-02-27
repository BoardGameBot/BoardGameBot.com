import { Message, Channel, User } from 'discord.js';
import { botSingleton, client, Player } from './state';

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

export function parseMention(mention: string): User | undefined {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches)
        return;
    return client.users.get(matches[1]);
}

export function convertUserToPlayer(user: User): Player {
    return {
        id: user.id,
        username: user.username
    };
}