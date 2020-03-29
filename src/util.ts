import { Message, Channel, User, Reply, ChannelType, Mention } from './messaging';
import { Player, GameChannel } from './state';
import { Id } from './id';
import { Canvas } from 'canvas';
import { MessagingEnvironment } from './MessagingEnvironment';

export function isEnabledInChannel(gameChannel: GameChannel | undefined, channel: Channel) {
  if (channel.type !== ChannelType.PUBLIC_GROUP) {
    return true;
  }
  return gameChannel && gameChannel.enabled;
}

export function isRawCommand(env: MessagingEnvironment, msg: Message, cmd: string): boolean {
  return msg.content.toLowerCase().startsWith(env.prefix + cmd);
}

export function isCommand(
  env: MessagingEnvironment,
  gameChannel: GameChannel | undefined,
  msg: Message,
  cmd: string,
): boolean {
  if (isEnabledInChannel(gameChannel, msg.channel) && isRawCommand(env, msg, cmd)) {
    return true;
  }
  return false;
}

export function isAnyCommand(env: MessagingEnvironment, gameChannel: GameChannel | undefined, msg: Message) {
  return isCommand(env, gameChannel, msg, '');
}

export function convertUserToPlayer(user: User): Player {
  return {
    id: user.id,
    username: user.username,
  };
}

export function equalId(id1: Id, id2: Id): boolean {
  return id1.namespace === id2.namespace && id1.value === id2.value;
}

export function simpleReply(type: ChannelType, content: string, mentions?: Mention[]): Reply {
  return {
    messages: [
      {
        type,
        content,
        mentions,
      },
    ],
  };
}

export function replyWithImage(type: ChannelType, content: string, image: Buffer, mentions?: Mention[]): Reply {
  return {
    messages: [
      {
        type,
        content,
        image,
        mentions,
      },
    ],
  };
}

export function fillBackground(canvas: Canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#36393F';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
