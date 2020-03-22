import { GameHandler } from './GameHandler';
import tictactoe from './tictactoe';
import { GameConfig } from 'boardgame.io/core';

export const GAMES_MAP: GameDefMap = {
  tictactoe: tictactoe,
};

export interface GameDef {
  code: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  gameConfig: GameConfig;
  initialHandler: typeof GameHandler;
  handlers: typeof GameHandler[];
}

export interface GameDefMap {
  [code: string]: GameDef;
}
