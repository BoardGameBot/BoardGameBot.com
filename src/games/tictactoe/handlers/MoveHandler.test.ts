jest.mock('../../../save');
import { save } from '../../../save';
import MoveHandler from './MoveHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../../../testing/mockUtil';
import FakeMessagingEnvironment from '../../../testing/FakeMessagingEnvironment';
import { Message } from '../.././../messaging';
import { GAMES_MAP } from '../../';

describe('TicTacToe .move', () => {
    let state;
    const bob = createUserMock('bobId', 'Bob');
    const alice = createUserMock('aliceId', 'Alice');
    const channel = createPublicChannelMock('#foo');
    const env = new FakeMessagingEnvironment();
    const msg: Message = { author: bob, channel, content: '.move' };

    test('should handle', async () => {
        state = defaultState();
        setActiveChannel(state, channel);
        state.channels['#foo'].currentGame = {
            gameCode: 'tictactoe',
            creator: bob,
            players: [bob, alice]
        };
        const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

        const result = await handler.handlesMessage();

        expect(result).toEqual(true);
    });
});