import { Namespace, Id } from '../id';
import { Message, User, Channel, ChannelType, Mention, Reply, ReplyMessage } from '../messaging';
import TelegramBot from 'node-telegram-bot-api';

function genId(value: number): Id {
  return { namespace: Namespace.TELEGRAM, value: value.toString() };
}

function encodeMentions(message: ReplyMessage): string {
  if (!message.mentions || message.mentions.length == 0) {
    return message.content;
  }
  const contentSplit = message.content.split(' ');
  for (const mention of message.mentions) {
    contentSplit[mention.wordIndex] = `@${mention.user}`;
  }
  return contentSplit.join(' ');
}

function sendMessageToChannel(client: TelegramBot, channel: TelegramBot.Chat, message: ReplyMessage) {
  if (message.image) {
    client.sendPhoto(channel.id, message.image, { caption: encodeMentions(message) });
  } else {
    client.sendMessage(channel.id, encodeMentions(message));
  }
}

function sendMessageToUser(client: TelegramBot, user: TelegramBot.User, message: ReplyMessage) {
  client.sendMessage(user.id, encodeMentions(message));
}

export function sendReplyToTelegram(client: TelegramBot, msg: TelegramBot.Message, reply: Reply) {
  for (const message of reply.messages) {
    if (message.type == ChannelType.PVT) {
      sendMessageToUser(client, msg.from, message);
    } else if (message.type == ChannelType.PUBLIC_GROUP) {
      sendMessageToChannel(client, msg.chat, message);
    } else {
      console.error(`Message "${message.content}" could not be sent: Unsupported channel type.`);
    }
  }
}

export async function translateTelegramMentions(msg: TelegramBot.Message): Promise<Mention[]> {
  const mentionEntities = msg.entities.filter(entity => entity.type === 'text_mention');
  const mentions = [];
  for (const mentionEntity of mentionEntities) {
    mentions.push({
      wordIndex: mentionEntity.offset,
      user: translateTelegramUser(mentionEntity.user),
    });
  }
  return mentions;
}

export function translateTelegramChannelType(channelType: string): ChannelType {
  switch (channelType) {
    case 'private':
      return ChannelType.PVT;
    case 'group':
      return ChannelType.PUBLIC_GROUP;
    default:
      return ChannelType.OTHER;
  }
}

export function translateTelegramChannel(msg: TelegramBot.Message): Channel {
  const author = msg.from;
  const channel = msg.chat;
  return {
    type: translateTelegramChannelType(channel.type),
    id: genId(channel.type == 'group' ? channel.id : author.id),
  };
}

export function translateTelegramUser(user: TelegramBot.User): User {
  return {
    id: genId(user.id),
    username: user.username,
  };
}

export async function translateTelegramMessage(msg: TelegramBot.Message): Promise<Message> {
  return {
    author: translateTelegramUser(msg.from),
    channel: translateTelegramChannel(msg),
    content: msg.text,
    mentions: await translateTelegramMentions(msg),
  };
}
