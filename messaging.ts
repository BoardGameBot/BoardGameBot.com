import { Id } from './id';

export interface User {
    id: Id;
    username: string;
}

export interface Mention {
    wordIndex: number;
    user: User;
}

export enum ChannelType {
    PVT, PUBLIC_GROUP, PRIVATE_GROUP
}

export interface Channel {
    type: ChannelType;
    id: Id;
    name: string;
}

export interface Message {
    author: User;
    channel: Channel;
    content: string;
    mentions?: Mention[];
}

export interface ReplyMessage {
    channel: Channel;
    content: string;
    mentions?: Mention[];
}

export interface Reply {
    messages: ReplyMessage[];
}