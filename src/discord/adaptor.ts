import * as discord from 'discord.js';
import { Namespace, Id } from '../id';
import { Message, User, Channel, ChannelType, Mention, Reply, ReplyMessage } from '../messaging';

function genId(value: string): Id {
  return { namespace: Namespace.DISCORD, value };
}

function encodeMentions(message: ReplyMessage): string {
  if (!message.mentions || message.mentions.length == 0) {
    return message.content;
  }
  const contentSplit = message.content.split(' ');
  for (const mention of message.mentions) {
    contentSplit[mention.wordIndex] = `<@${mention.user.id.value}>`;
  }
  return contentSplit.join(' ');
}

function sendMessageToChannel(channel: discord.Channel, message: ReplyMessage) {
  if (channel.type !== 'text') {
    console.error(`Message "${message.content}" could not be sent: Wrong reply channel type.`);
    return;
  }
  const textChannel: discord.TextChannel = channel as discord.TextChannel;
  textChannel.send(encodeMentions(message));
}

function sendMessageToUser(user: discord.User, message: ReplyMessage) {
  user.send(encodeMentions(message));
}

export function sendReplyToDiscord(msg: discord.Message, reply: Reply) {
  for (const message of reply.messages) {
    if (message.type == ChannelType.PVT) {
      sendMessageToUser(msg.author, message);
    } else if (message.type == ChannelType.PUBLIC_GROUP) {
      sendMessageToChannel(msg.channel, message);
    } else {
      console.error(`Message "${message.content}" could not be sent: Unsupported channel type.`);
    }
  }
}

export async function translateDiscordMentions(msg: discord.Message): Promise<Mention[]> {
  const rawMentions = msg.content
    .split(' ')
    .map((content, index) => ({ match: content.match(/^<@!?(\d+)>$/), index }))
    .filter(word => word.match && word.match[1]);
  const usersPromise = rawMentions.map(word => word.match[1]).map(userId => msg.client.users.fetch(userId));
  return (await Promise.all(usersPromise)).map((user, index) => ({
    wordIndex: rawMentions[index].index,
    user: translateDiscordUser(user),
  }));
}

export function translateDiscordChannelType(channelType: string): ChannelType {
  // https://discord.js.org/#/docs/main/stable/class/Channel?scrollTo=type
  switch (channelType) {
    case 'dm':
      return ChannelType.PVT;
    case 'text':
      return ChannelType.PUBLIC_GROUP;
    default:
      return ChannelType.OTHER;
  }
}

export function translateDiscordChannel(msg: discord.Message): Channel {
  const author = msg.author;
  const channel = msg.channel;
  const guild = msg.guild;
  return {
    type: translateDiscordChannelType(channel.type),
    id: genId(channel.type == 'text' ? channel.id : author.id),
    serverId: guild ? genId(guild.id) : undefined,
  };
}

export function translateDiscordUser(user: discord.User): User {
  return {
    id: genId(user.id),
    username: user.username,
  };
}

export async function translateDiscordMessage(msg: discord.Message): Promise<Message> {
  return {
    author: translateDiscordUser(msg.author),
    channel: translateDiscordChannel(msg),
    content: msg.content,
    mentions: await translateDiscordMentions(msg),
  };
}
