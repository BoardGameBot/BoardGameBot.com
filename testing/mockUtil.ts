import { Bot, botSingleton } from "../state"
import { Message, Client, TextChannel, Guild, Channel, ClientUser } from 'discord.js';

const DEFAULT_OWN_USER_ID = 'boardgamebot_id';

export function setupDefaultMocks() {
    const clientMock = new Client();
    clientMock.user = new ClientUser(clientMock, { id: DEFAULT_OWN_USER_ID });
    const guildMock = new Guild(clientMock, { emojis: [] });
    const channelMock = new TextChannel(guildMock, {});
    const msgMock = new Message(clientMock, {}, channelMock);
    return { clientMock, guildMock, channelMock, msgMock };
}

export function mockActiveChannel(channelMock: Channel, stateOverwrite?: Bot) {
    const id = '1234';
    channelMock.id = id;
    const state: Bot = { channels: {} };
    state.channels[id] = { enabled: true };
    if (stateOverwrite) {
        Object.assign(state, stateOverwrite);
    }
    mockLoad(state);
}

export function mockLoad(state: Bot) {
    botSingleton.channels = {};
    Object.assign(botSingleton, state);
}