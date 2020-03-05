import { Bot } from "../state";

export function mockActiveChannel(state: Bot, id: string) {
    state.channels[id] = { enabled: true };
}

export function defaultState(): Bot {
    return { channels: {} };
}