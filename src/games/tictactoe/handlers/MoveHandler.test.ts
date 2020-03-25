jest.mock('../../../save');
import { save } from '../../../save';
import MoveHandler from './MoveHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../../../testing/mockUtil';
import FakeMessagingEnvironment from '../../../testing/FakeMessagingEnvironment';
import { Message } from '../.././../messaging';
import { GAMES_MAP } from '../../';
import { TictactoeGame } from '../game';
import { Client } from 'boardgame.io/client';

describe('TicTacToe .move', () => {
  let state;
  let msg: Message;
  const bob = createUserMock('bobId', 'Bob');
  const alice = createUserMock('aliceId', 'Alice');
  const channel = createPublicChannelMock('#foo');
  const env = new FakeMessagingEnvironment();

  beforeEach(() => {
    msg = { author: bob, channel, content: '.move A2' };
  });

  test('should handle', async () => {
    state = defaultState();
    setActiveChannel(state, channel);
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.handlesMessage();

    expect(result).toEqual(true);
  });

  test('invalid command', async () => {
    msg.content = '.move Z4';
    state = defaultState();
    setActiveChannel(state, channel);
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.reply();

    expect(result.messages[0].content).toContain('Invalid command');
  });

  test('not players turn', async () => {
    state = defaultState();
    setActiveChannel(state, channel);
    msg.author = alice;
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.reply();

    expect(result.messages[0].content).toContain('not your turn');
  });

  test('simple move', async () => {
    state = defaultState();
    setActiveChannel(state, channel);
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
    };
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.reply();

    expect(save).toHaveBeenCalled();
    expect(result.messages[0].content).toContain('Done');
  });

  test('winning', async () => {
    const client = Client({
      game: {
        ...TictactoeGame,
        setup: () => ({
          cells: ['0', '0', null, '1', '1', null, null, null, null],
        }),
      },
    });
    state = defaultState();
    setActiveChannel(state, channel);
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
      state: client.store.getState(),
    };
    msg.content = '.move A3';
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.reply();

    expect(save).toHaveBeenCalled();
    expect(result.messages[0].content).toContain('wins');
  });

  test('draw', async () => {
    const client = Client({
      game: {
        ...TictactoeGame,
        setup: () => ({
          cells: ['0', '0', '1', '1', '1', '0', '0', '1', null],
        }),
      },
    });
    state = defaultState();
    setActiveChannel(state, channel);
    state.channels['#foo'].currentGame = {
      gameCode: 'tictactoe',
      creator: bob,
      players: [bob, alice],
      state: client.store.getState(),
    };
    msg.content = '.move C3';
    const handler = new MoveHandler(state, msg, env, GAMES_MAP['tictactoe']);

    const result = await handler.reply();

    expect(save).toHaveBeenCalled();
    expect(result.messages[0].content).toContain('draw');
  });
});
