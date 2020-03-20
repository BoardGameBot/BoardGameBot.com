jest.mock('../save');
import { save } from '../save';
import DisableHandler from './DisableHandler';
import { setActiveChannel, defaultState, createPublicChannelMock, createUserMock } from '../testing/mockUtil';
import FakeMessagingEnvironment from '../testing/FakeMessagingEnvironment';
import { Message } from '../messaging';

describe('Disable Handler', () => {
  let state;
  let env: FakeMessagingEnvironment;

  beforeEach(() => {
    state = defaultState();
    env = new FakeMessagingEnvironment();
  });

  describe('.disable', () => {
    const author = createUserMock('bobId', 'Bob');
    const channel = createPublicChannelMock('#foo');
    const msg: Message = { author, channel, content: '.disable' };

    test('should handle', async () => {
      setActiveChannel(state, channel);
      const handler = new DisableHandler(state, msg, env);

      const result = await handler.handlesMessage();

      expect(result).toEqual(true);
    });

    test('reply should disable', async () => {
      env.setIsAdmin(true);
      setActiveChannel(state, channel);
      const handler = new DisableHandler(state, msg, env);

      const result = await handler.reply();

      expect(result.messages.length).toEqual(1);
      expect(save).toHaveBeenCalled();
      expect(state.channels['#foo'].enabled).toBe(false);
    });
  });
});
