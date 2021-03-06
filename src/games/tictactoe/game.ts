import { GameConfig } from 'boardgame.io/core';

export function isVictory(cells: string[]) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pos of positions) {
    const symbol = cells[pos[0]];
    let winner = symbol;
    for (const i of pos) {
      if (cells[i] !== symbol) {
        winner = null;
        break;
      }
    }
    if (winner != null) {
      return pos;
    }
  }
  return null;
}

export interface TictactoeGameState {
  cells: string[];
}

export const TictactoeGame: GameConfig = {
  name: 'tictactoe',

  setup: () =>
    ({
      cells: Array(9).fill(null),
    } as TictactoeGameState),

  moves: {
    clickCell(G: TictactoeGameState, ctx: any, id: number) {
      const cells = [...G.cells];

      if (cells[id] === null) {
        cells[id] = ctx.currentPlayer;
        return { ...G, cells };
      }
    },
  },

  turn: {
    moveLimit: 1,
  },

  endIf: (G: TictactoeGameState, ctx) => {
    const victory = isVictory(G.cells);
    if (victory) {
      return { winner: ctx.currentPlayer, winningCells: victory };
    }
    if (G.cells.filter((c: any) => c === null).length === 0) {
      return { draw: true };
    }
  },
};
