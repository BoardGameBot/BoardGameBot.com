import * as Discord from 'discord.js';

export interface User {
    id: string;
    username: string;
};

export interface Game {
    game_code: string;
    state: Object;
    users: User[];
};

export interface Channel {
    enabled: boolean;
    currentGame?: Game;
};

export interface Channels {
    [channelId: string]: Channel
};

export interface Bot {
    channels: Channels;
};

export const client = new Discord.Client();
export const botSingleton: Bot = {
    channels: {}
};