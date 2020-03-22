jest.mock('../save');
import { save } from '../save';
import AcceptHandler from './AcceptHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock, mockId } from '../testing/mockUtil';
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';
import { Bot } from '../state';

describe('Accept Handler', () => {
  let state: Bot;
  let env: FakeMessagingEnvironment;

  beforeEach(() => {
    state = defaultState();
    env = new FakeMessagingEnvironment();
  });

  describe('.accept', () => {
    const author = createUserMock('bob', 'Bob');
    const channel = createPublicChannelMock('#foo');
    const msg: Message = { author, channel, content: '.accept' };

    test('should handle', async () => {
      setActiveChannel(state, channel);
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.handlesMessage();

      expect(result).toEqual(true);
    });

    test('no active invite', async () => {
      setActiveChannel(state, channel);
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('No active');
    });

    test('not part of the invite', async () => {
      state.channels['#foo'] = {
        enabled: true,
        invites: {
          gameCode: 'tictactoe',
          players: [
            { id: mockId('alice'), username: 'Alice' },
            { id: mockId('joe'), username: 'Joe' },
          ],
          accepted: [{ id: mockId('alice'), username: 'Alice' }],
        },
      };
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('not part');
    });

    test('already accepted invite', async () => {
      state.channels['#foo'] = {
        enabled: true,
        invites: {
          gameCode: 'tictactoe',
          players: [
            { id: mockId('bob'), username: 'Bob' },
            { id: mockId('alice'), username: 'Alice' },
          ],
          accepted: [{ id: mockId('bob'), username: 'Bob' }],
        },
      };
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('already accepted');
    });

    test('Invite accepted', async () => {
      state.channels['#foo'] = {
        enabled: true,
        invites: {
          gameCode: 'tictactoe',
          players: [
            { id: mockId('joe'), username: 'Joe' },
            { id: mockId('bob'), username: 'Bob' },
            { id: mockId('alice'), username: 'Alice' },
          ],
          accepted: [{ id: mockId('joe'), username: 'Joe' }],
        },
      };
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.reply();

      expect(save).toHaveBeenCalled();
      expect(result.messages[0].content).toContain('Invite accepted');
    });

    test('Match starting', async () => {
      state.channels['#foo'] = {
        enabled: true,
        invites: {
          gameCode: 'tictactoe',
          players: [
            { id: mockId('joe'), username: 'Joe' },
            { id: mockId('bob'), username: 'Bob' },
          ],
          accepted: [{ id: mockId('joe'), username: 'Joe' }],
        },
      };
      const handler = new AcceptHandler(state, msg, env);

      const result = await handler.reply();

      expect(save).toHaveBeenCalled();
      expect(result.messages[0].content).toContain('is starting');
    });
  });
});
