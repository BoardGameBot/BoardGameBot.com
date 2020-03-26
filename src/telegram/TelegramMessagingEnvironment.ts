import { MessagingEnvironment } from '../MessagingEnvironment';
import TelegramBot from 'node-telegram-bot-api';
import { User, Channel } from '../messaging';

export default class TelegramMessagingEnvironment extends MessagingEnvironment {
  client: TelegramBot;

  constructor(client: TelegramBot) {
    super();
    this.client = client;
    this.prefix = '/';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isAdmin(user: User, channel: Channel) {
    // TODO stub
    return true;
  }
}
