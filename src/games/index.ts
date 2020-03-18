import { GameHandler } from './GameHandler';
import tictactoe from './tictactoe';

export const GAMES_MAP: GameDefMap = {
    'tictactoe': tictactoe
};

export interface GameDef {
    code: string;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    handler: typeof GameHandler;
}

export interface GameDefMap {
    [code: string]: GameDef;
}