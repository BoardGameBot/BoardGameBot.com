jest.mock('../save');
import InviteHandler from './InviteHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock, mockId } from '../testing/mockUtil'
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';
import { Bot } from '../state';

describe('Invite Handler', () => {
    let state: Bot;
    let env: FakeMessagingEnvironment;

    beforeEach(() => {
        state = defaultState();
        env = new FakeMessagingEnvironment();
    })

    describe('.invite', () => {
        const author = createUserMock('bob', 'Bob');
        const channel = createPublicChannelMock('#foo');
        const msg: Message = { author, channel, content: '.invite' };

        test('should handle', async () => {
            setActiveChannel(state, channel);
            const handler = new InviteHandler(state, msg, env);

            const result = await handler.handlesMessage();

            expect(result).toEqual(true);
        });

        // TODO: FINISH THIS
    })
})