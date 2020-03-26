import { MessagingEnvironment } from '../MessagingEnvironment';
import TelegramBot from 'node-telegram-bot-api';
import { User, Channel } from '../messaging';
import assert from 'assert';
import { Namespace } from '../id';

export default class DiscordMessagingEnvironment extends MessagingEnvironment {
  client: TelegramBot;

  constructor(client: TelegramBot) {
    super();
    this.client = client;
  }

  async isAdmin(user: User, channel: Channel) {
    // TODO stub
    return true;
    // assert(user.id.namespace === Namespace.DISCORD);
    // assert(channel.id.namespace === Namespace.DISCORD);
    // assert(channel.serverId.namespace === Namespace.DISCORD);
    // const guild = this.client.guilds.resolve(channel.serverId.value);
    // const member = guild.member(user.id.value);
    // return member.hasPermission('KICK_MEMBERS', { checkAdmin: true });
  }
}
