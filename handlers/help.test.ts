import HelpHandler from './help';
import { mockActiveChannel, setupDefaultMocks, mockBotState } from '../testing/mockUtil'

describe('Help Handler', () => {
    const mocks = setupDefaultMocks();
    const handler = new HelpHandler(mocks.msgMock);

    test('should reply to ".help"', async () => {
        mockBotState();
        mockActiveChannel(mocks.channelMock);
        mocks.msgMock.content = '.help';

        const result = await handler.handlesMessage();

        expect(result).toEqual(true);
    });
})