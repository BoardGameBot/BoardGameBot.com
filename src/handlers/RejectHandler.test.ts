jest.mock('../save');
import { save } from '../save';
import RejectHandler from './RejectHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock, mockId } from '../testing/mockUtil'
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';

describe('Reject Handler', () => {
    let state;
    let env: FakeMessagingEnvironment;

    beforeEach(() => {
        state = defaultState();
        env = new FakeMessagingEnvironment();
    })

    describe('.reject', () => {
        const author = createUserMock('bob', 'Bob');
        const channel = createPublicChannelMock('#foo');
        const msg: Message = { author, channel, content: '.reject' };

        test('should handle', async () => {
            setActiveChannel(state, channel);
            const handler = new RejectHandler(state, msg, env);

            const result = await handler.handlesMessage();

            expect(result).toEqual(true);
        });

        test('no active invites', async () => {
            state.channels["#foo"] = { enabled: true };
            const handler = new RejectHandler(state, msg, env);

            const result = await handler.reply();

            expect(result.messages[0].content).toContain('No active invite');
        });

        test('not part of the invite', async () => {
            state.channels["#foo"] = {
                enabled: true,
                invites: {
                    gameCode: 'tictactoe',
                    players: [
                        { id: mockId('joe'), username: 'Joe' },
                        { id: mockId('alice'), username: 'Alice' }
                    ],
                    accepted: [
                        { id: mockId('joe'), username: 'Joe' },
                    ]
                }
            };
            const handler = new RejectHandler(state, msg, env);

            const result = await handler.reply();

            expect(result.messages[0].content).toContain('not part');
        });

        test('should reject', async () => {
            state.channels["#foo"] = {
                enabled: true,
                invites: {
                    gameCode: 'tictactoe',
                    players: [
                        { id: mockId('joe'), username: 'Joe' },
                        { id: mockId('bob'), username: 'Bob' },
                        { id: mockId('alice'), username: 'Alice' }
                    ],
                    accepted: [
                        { id: mockId('joe'), username: 'Joe' },
                    ]
                }
            };
            const handler = new RejectHandler(state, msg, env);

            const result = await handler.reply();

            expect(save).toHaveBeenCalled();
            expect(result.messages[0].content).toContain('Invite rejected');
        });
    });
})