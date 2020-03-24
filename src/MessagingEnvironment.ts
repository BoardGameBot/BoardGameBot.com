import { User, Channel } from './messaging';

export class MessagingEnvironment {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isAdmin(user: User, channel: Channel) {
    return false;
  }
}
