import { Bot } from "../src/state";
import { Channel, ChannelType, User } from '../src/messaging';
import { Namespace, Id } from "../src/id";

export function setActiveChannel(state: Bot, channel: Channel) {
    state.channels[channel.id.value] = { enabled: true };
}

export function defaultState(): Bot {
    return { channels: {} };
}

export function mockId(value: string): Id {
    return { namespace: Namespace.DISCORD, value };
}

export function createPublicChannelMock(id: string, serverId?: string): Channel {
    return {
        type: ChannelType.PUBLIC_GROUP,
        id: mockId(id),
        serverId: serverId ? mockId(serverId) : undefined,
    };
}

export function createUserMock(id: string, username: string): User {
    return { id: { namespace: Namespace.DISCORD, value: id }, username };
}