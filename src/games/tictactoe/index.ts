import MoveHandler from './handlers/MoveHandler';
import { GameDef } from '../index';
import { TictactoeGame } from './game';
import InitialHandler from './handlers/InitialHandler';

const game: GameDef = {
  code: 'tictactoe',
  name: 'Tic Tac Toe',
  description: 'Classic game of Tic-Tac-Toe',
  minPlayers: 2,
  maxPlayers: 2,
  initialHandler: InitialHandler,
  gameConfig: TictactoeGame,
  handlers: [MoveHandler],
};

export default game;
