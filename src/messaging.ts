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
  PVT,
  PUBLIC_GROUP,
  PRIVATE_GROUP,
  OTHER,
}

export interface Channel {
  type: ChannelType;
  id: Id;
  serverId?: Id;
}

export interface Message {
  author: User;
  channel: Channel;
  content: string;
  mentions?: Mention[];
}

export interface ReplyMessage {
  type: ChannelType;
  content: string;
  mentions?: Mention[];
}

export interface Reply {
  messages: ReplyMessage[];
}
