jest.mock('../save');
import { save } from '../save';
import { GameHandler } from './GameHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../testing/mockUtil';
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';
import { GAMES_MAP } from '.';

describe('Game Handler', () => {
  let state;
  const bob = createUserMock('bobId', 'Bob');
  const alice = createUserMock('aliceId', 'Alice');
  const channel = createPublicChannelMock('#foo');
  const env = new FakeMessagingEnvironment();
  const msg: Message = { author: bob, channel, content: '.foo' };

  beforeEach(() => {
    state = defaultState();
    setActiveChannel(state, channel);
  });

  test('isActivePlayer', async () => {
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new GameHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const isCurrentPlayer = handler.isCurrentPlayer();

    // Bob's turn because he is the first player.
    expect(isCurrentPlayer).toEqual(true);
  });

  test('getPlayerFromId', async () => {
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new GameHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = handler.getPlayerFromIndex('1');

    expect(result).toEqual(alice);
  });

  test('state loaded', async () => {
    const mockState = { foo: 'bar' };
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
      state: mockState,
    };
    const handler = new GameHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const storeState = handler.game.store.getState();

    expect(storeState).toEqual(mockState);
  });

  test('state loaded and saved', async () => {
    const mockState = { foo: 'bar' };
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
      state: mockState,
    };
    const handler = new GameHandler(state, msg, env, GAMES_MAP['tictactoe']);

    await handler.save();

    expect(save).toHaveBeenCalledWith(state);
  });
});
