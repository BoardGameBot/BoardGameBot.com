import { Message, Channel, User, Reply, ChannelType } from './messaging';
import { Player, GameChannel } from './state';

export const PREFIX = '.';

export function isEnabledInChannel(gameChannel: GameChannel | undefined, channel: Channel) {
    if (channel.type !== ChannelType.PUBLIC_GROUP) {
        return true;
    }
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

export function convertUserToPlayer(user: User): Player {
    return {
        id: user.id,
        username: user.username
    };
}

export function simpleReply(type: ChannelType, content: string): Reply {
    return {
        messages: [
            {
                type,
                content
            }
        ]
    };
}