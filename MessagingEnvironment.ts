import { User, Channel } from './messaging';

export class MessagingEnvironment {
    isAdmin(user: User, channel: Channel) {
        return false;
    }
}