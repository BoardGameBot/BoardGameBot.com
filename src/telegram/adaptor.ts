import { Namespace, Id } from '../id';
import { Message, User, Channel, ChannelType, Mention, Reply, ReplyMessage } from '../messaging';
import TelegramBot from 'node-telegram-bot-api';

function genId(value: number): Id {
  return { namespace: Namespace.TELEGRAM, value: value.toString() };
}

function genUsernameId(username: string): Id {
  return { namespace: Namespace.TELEGRAM_USERNAME, value: username };
}

function encodeMentions(message: ReplyMessage): string {
  if (!message.mentions || message.mentions.length == 0) {
    return message.content;
  }
  const contentSplit = message.content.split(' ');
  for (const mention of message.mentions) {
    contentSplit[mention.wordIndex] = `[${mention.user.username}](tg://user?id=${mention.user.id.value})`;
  }
  return contentSplit.join(' ');
}

function sendMessageToChannel(client: TelegramBot, channel: TelegramBot.Chat, message: ReplyMessage) {
  if (message.image) {
    client.sendPhoto(channel.id, message.image);
  }
  // eslint-disable-next-line @typescript-eslint/camelcase
  client.sendMessage(channel.id, encodeMentions(message), { parse_mode: 'Markdown' });
}

function sendMessageToUser(client: TelegramBot, user: TelegramBot.User, message: ReplyMessage) {
  client.sendMessage(user.id, encodeMentions(message));
}

export function sendReplyToTelegram(client: TelegramBot, msg: TelegramBot.Message, reply: Reply) {
  for (const message of reply.messages) {
    if (message.type == ChannelType.PVT) {
      if (msg.chat.type == 'group') {
        sendMessageToChannel(client, msg.chat, {
          type: ChannelType.PUBLIC_GROUP,
          content:
            'A private message was sent to you. If you did not receive it, you need to first send a message to me privately and repeat the command here.',
        });
      }
      sendMessageToUser(client, msg.from, message);
    } else if (message.type == ChannelType.PUBLIC_GROUP) {
      sendMessageToChannel(client, msg.chat, message);
    } else {
      console.error(`Message "${message.content}" could not be sent: Unsupported channel type.`);
    }
  }
}

function telegramUserFromMention(msg, mentionEntity): User {
  const offset = mentionEntity.offset;
  const username = msg.text.substr(offset, offset + mentionEntity.length);
  return {
    id: genUsernameId(username.substr(1)),
    username,
  };
}

export async function translateTelegramMentions(msg: TelegramBot.Message): Promise<Mention[]> {
  if (!msg.entities) return [];
  const mentionEntities = msg.entities.filter(entity => entity.type == 'text_mention' || entity.type == 'mention');
  const mentions = [];
  for (const mentionEntity of mentionEntities) {
    if (mentionEntity.type == 'text_mention') {
      mentions.push({
        wordIndex: mentionEntity.offset,
        user: translateTelegramUser(mentionEntity.user),
      });
    } else {
      mentions.push({
        wordIndex: mentionEntity.offset,
        user: telegramUserFromMention(msg, mentionEntity),
      });
    }
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
  if (user.username) {
    return {
      id: genUsernameId(user.username),
      username: user.username,
    };
  } else {
    return {
      id: genId(user.id),
      username: user.first_name,
    };
  }
}

export async function translateTelegramMessage(msg: TelegramBot.Message): Promise<Message> {
  return {
    author: translateTelegramUser(msg.from),
    channel: translateTelegramChannel(msg),
    content: msg.text,
    mentions: await translateTelegramMentions(msg),
  };
}
