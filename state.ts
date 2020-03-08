import * as Discord from 'discord.js';
import { Id } from './Id';

export interface Player {
    id: Id;
    username: string;
};

export interface Game {
    gameCode: string;
    state: Object;
    creator: Player;
    players: Player[];
};

export interface GameInvites {
    gameCode: string;
    players: Player[];
    accepted: Player[];
}

export interface GameChannel {
    enabled: boolean;
    currentGame?: Game;
    invites?: GameInvites;
};

export interface BotChannels {
    [channelId: string]: GameChannel
};

export interface Bot {
    channels: BotChannels;
};

export const client = new Discord.Client();