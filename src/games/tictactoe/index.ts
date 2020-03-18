import TicTacToeGameHandler from './TicTacToeGameHandler';
import { GameDef } from '../index';

const game: GameDef = {
    code: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic game of Tic-Tac-Toe',
    minPlayers: 2,
    maxPlayers: 2,
    handler: TicTacToeGameHandler
};

export default game;