import { Message, Reply, Mention, ChannelType } from './messaging';
import { GameChannel, Bot } from './state';
import { MessagingEnvironment } from './MessagingEnvironment';
import { simpleReply, replyWithImage } from './util';

export class MessageHandler {
  name: string;
  msg: Message;
  state: Bot;
  channel: GameChannel | undefined;
  env: MessagingEnvironment;

  constructor(state: Bot, msg: Message, env: MessagingEnvironment) {
    this.msg = msg;
    this.state = state;
    this.channel = state.channels[msg.channel.id.value];
    this.env = env;
  }

  /** Whether or not this specific handler cares about this message.*/
  /* istanbul ignore next */
  public async handlesMessage(): Promise<boolean> {
    // stub
    return Promise.resolve(false);
  }

  /** Reply to the message (will only be called when handlesMessage returns true). */
  /* istanbul ignore next */
  public async reply(): Promise<Reply> {
    // stub
    return Promise.resolve({ messages: [] });
  }

  protected simpleReply(content: string, mentions?: Mention[]): Reply {
    return simpleReply(this.msg.channel.type, content, mentions);
  }

  protected replyWithImage(content: string, image: Buffer, mentions?: Mention[]): Reply {
    return replyWithImage(this.msg.channel.type, content, image, mentions);
  }

  protected pvtReply(content: string): Reply {
    return simpleReply(ChannelType.PVT, content);
  }
}
