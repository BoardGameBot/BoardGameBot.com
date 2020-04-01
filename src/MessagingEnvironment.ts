import { User, Channel } from './messaging';

/* istanbul ignore next */
export class MessagingEnvironment {
  prefix = '.';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isAdmin(user: User, channel: Channel) {
    // stub
    return false;
  }
}
