jest.mock('../save');
import { save } from '../save';
import InviteHandler from './InviteHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock, mockId } from '../testing/mockUtil';
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message, Channel, User } from '../messaging';
import { Bot, Player } from '../state';

describe('Invite Handler', () => {
  let state: Bot;
  let env: FakeMessagingEnvironment;

  beforeEach(() => {
    state = defaultState();
    env = new FakeMessagingEnvironment();
  });

  describe('.invite', () => {
    let author: User, channel: Channel, msg: Message;
    beforeEach(() => {
      author = createUserMock('bob', 'Bob');
      channel = createPublicChannelMock('#foo');
      msg = { author, channel, content: '.invite' };
    });

    test('should handle', async () => {
      setActiveChannel(state, channel);
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.handlesMessage();

      expect(result).toEqual(true);
    });

    test('game in progress', async () => {
      const joe: Player = { id: mockId('joe'), username: 'Joe' };
      state.channels['#foo'] = {
        enabled: true,
        currentGame: { gameCode: 'tictactoe', creator: joe, players: [joe] },
      };
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('in progress');
    });

    test('number of arguments', async () => {
      setActiveChannel(state, channel);
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('usage');
    });

    test('valid game', async () => {
      setActiveChannel(state, channel);
      msg.content = '.invite doesnotexit @player1';
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('Invalid game');
    });

    test('invalid user selection', async () => {
      setActiveChannel(state, channel);
      msg.content = '.invite tictactoe @Bob';
      msg.mentions = [{ user: author, wordIndex: 2 }];
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('Invalid selection');
    });

    test('invalid user selection', async () => {
      setActiveChannel(state, channel);
      msg.content = '.invite tictactoe NotAUser';
      msg.mentions = [];
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages[0].content).toContain('Not enough users');
    });

    test('invite', async () => {
      const joe: Player = { id: mockId('joe'), username: 'Joe' };
      setActiveChannel(state, channel);
      msg.content = '.invite tictactoe @Joe';
      msg.mentions = [{ user: joe, wordIndex: 2 }];
      const handler = new InviteHandler(state, msg, env);

      const result = await handler.reply();

      expect(save).toHaveBeenCalled();
      expect(result.messages[0].content).toContain('want to play');
    });
  });
});
