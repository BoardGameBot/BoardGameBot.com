jest.mock('../save');
import { save } from '../save';
import EnableHandler from './EnableHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../../testing/mockUtil'
import FakeMessagingEnvironment from '../../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';

describe('Enable Handler', () => {
    let state;
    let env: FakeMessagingEnvironment;

    beforeEach(() => {
        state = defaultState();
        env = new FakeMessagingEnvironment();
    })

    describe('.enable', () => {
        const author = createUserMock('bobId', 'Bob');
        const channel = createPublicChannelMock('#foo');
        const msg: Message = { author, channel, content: '.enable-bgb' };

        test('should handle', async () => {
            setActiveChannel(state, channel);
            const handler = new EnableHandler(state, msg, env);

            const result = await handler.handlesMessage();

            expect(result).toEqual(true);
        });

        test('should enable', async () => {
            env.setIsAdmin(true);
            const handler = new EnableHandler(state, msg, env);

            const result = await handler.reply();

            expect(result.messages.length).toEqual(1);
            expect(save).toHaveBeenCalled();
            expect(state.channels['#foo'].enabled).toBe(true);
        });
    });
})