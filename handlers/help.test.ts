import HelpHandler from './help';
import { mockActiveChannel, defaultState } from '../testing/mockUtil'

describe('Help Handler', () => {
    let state;
    let msgMock;

    beforeEach(() => {
        state = defaultState();
        msgMock = { channel: { id: '#foo' } } as any;
    })

    test('should handle ".help"', async () => {
        mockActiveChannel(state, '#foo');
        const handler = new HelpHandler(state, msgMock);
        msgMock.content = '.help';

        const result = await handler.handlesMessage();

        expect(result).toEqual(true);
    });

    test('should reply to ".help"', async () => {
        mockActiveChannel(state, '#foo');
        const handler = new HelpHandler(state, msgMock);
        msgMock.content = '.help';
        const sendMock = jest.fn();
        msgMock.author = { send: sendMock };

        await handler.reply();

        expect(sendMock).toBeCalledTimes(1);
    })
})