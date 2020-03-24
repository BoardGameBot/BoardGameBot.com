import HelpHandler from './HelpHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../testing/mockUtil';
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';

describe('Help Handler', () => {
  let state;
  let env;

  beforeEach(() => {
    state = defaultState();
    env = new FakeMessagingEnvironment();
  });

  describe('.help', () => {
    const author = createUserMock('bobId', 'Bob');
    const channel = createPublicChannelMock('#foo');
    const msg: Message = { author, channel, content: '.help' };

    test('should handle ".help"', async () => {
      setActiveChannel(state, channel);
      const handler = new HelpHandler(state, msg, env);

      const result = await handler.handlesMessage();

      expect(result).toEqual(true);
    });

    test('should reply to ".help"', async () => {
      setActiveChannel(state, channel);
      const handler = new HelpHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages.length).toEqual(1);
    });
  });
});
