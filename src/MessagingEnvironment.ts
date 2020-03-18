import { User, Channel } from './messaging';

export class MessagingEnvironment {
    async isAdmin(user: User, channel: Channel) {
        return false;
    }
}