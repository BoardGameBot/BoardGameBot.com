import HelpHandler from './help';
import { mockActiveChannel, setupDefaultMocks } from '../testing/mockUtil'
import { Message } from 'discord.js';

describe('Help Handler', () => {
    const mocks = setupDefaultMocks();
    const handler = new HelpHandler(mocks.msgMock);

    test('should reply to ".help"', async () => {
        mockActiveChannel(mocks.channelMock);
        mocks.msgMock.content = '.help';

        const result = await handler.handlesMessage();

        expect(result).toEqual(true);
    });
})