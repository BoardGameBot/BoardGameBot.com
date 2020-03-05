jest.mock('../save');
import { save } from '../save';
import DisableHandler from './disable';
import { mockActiveChannel, defaultState } from '../testing/mockUtil'
import { Message } from 'discord.js';

describe('Disable Handler', () => {
    let msgMock;
    let sendMock;
    let state;

    beforeEach(() => {
        state = defaultState();
        sendMock = jest.fn();
        msgMock = { channel: { id: '#foo', send: sendMock } } as any;
    })

    test('should disable active channel', async () => {
        mockActiveChannel(state, '#foo');
        const handler = new DisableHandler(state, msgMock);
        msgMock.content = '.disable';
        msgMock.member = { hasPermission: () => true };

        const result = await handler.reply();

        expect(save).toHaveBeenCalled();
        expect(sendMock).toHaveBeenCalled();
        expect(state.channels['#foo'].enabled).toBe(false);
    });
})