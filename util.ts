import { Message, Channel, User } from 'discord.js';
import { client, Player, Bot, GameChannel } from './state';

export const PREFIX = '.';

export function authorizeAdminOnly(msg: Message, callback: () => void) {
    if (msg.member.hasPermission('KICK_MEMBERS', { checkAdmin: true })) {
        callback();
    } else {
        msg.channel.send('Sorry, you need to be a server admin/owner to do that.');
    }
}

export function isEnabledInChannel(gameChannel: GameChannel | undefined, channel: Channel) {
    return gameChannel && gameChannel.enabled;
}

export function isRawCommand(msg: Message, cmd: string): boolean {
    return msg.content.toLowerCase().startsWith(PREFIX + cmd);
}

export function isCommand(gameChannel: GameChannel | undefined, msg: Message, cmd: string): boolean {
    if (isEnabledInChannel(gameChannel, msg.channel) && isRawCommand(msg, cmd)) {
        return true;
    }
    return false;
}

export function isAnyCommand(gameChannel: GameChannel | undefined, msg: Message) {
    return isCommand(gameChannel, msg, '');
}

export function parseMention(mention: string): Promise<User> {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches)
        return;
    return client.users.fetch(matches[1]);
}

export function convertUserToPlayer(user: User): Player {
    return {
        id: user.id,
        username: user.username
    };
}