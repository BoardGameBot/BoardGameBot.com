import { Client } from 'boardgame.io/client';
import { MosaicGame } from './game';
import { MosaicGameState, Color } from './definitions';
import { DEFAULT_BOARD, DEFAULT_TEMPLATE } from './constants';
import { getBucketSize, makeMove } from './util';

describe('Mosaic Game Rules', () => {
  it('should initialize a 3 player game correctly', () => {
    const client = Client({
      game: MosaicGame,
      numPlayers: 3,
    });

    const G: MosaicGameState = client.store.getState().G;

    expect(G.boards.length).toEqual(3);
    expect(G.centerBucket.penalty).toEqual(1);
    expect(G.restrictedBuckets.length).toEqual(7);
    expect(getBucketSize(G.restrictedBuckets[0])).toEqual(4);
    expect(getBucketSize(G.bag)).toEqual(100 - 7 * 4);
  });

  it('should move from restricted bucket to normal row correctly', () => {
    const client = Client({
      game: { ...MosaicGame, seed: 1 },
      numPlayers: 2,
    });

    // First restricted: {"maxSize":4,"black":2,"red":1,"blue":1}
    client.moves.move(makeMove(0, Color.BLACK, 4));
    const G: MosaicGameState = client.store.getState().G;
    expect(G.boards[0].rows[4]).toEqual({ maxSize: 5, black: 2 });
    expect(getBucketSize(G.restrictedBuckets[0])).toEqual(0);
    expect(G.centerBucket).toEqual({ penalty: 1, red: 1, blue: 1, yellow: 0, green: 0, black: 0 });
  });

  it('should move from center bucket to normal row correctly', () => {
    const client = Client({
      game: { ...MosaicGame, seed: 1 },
      numPlayers: 2,
    });

    // First restricted: {"maxSize":4,"black":2,"red":1,"blue":1}
    client.moves.move(makeMove(0, Color.BLACK, 4));
    client.moves.move(makeMove(-1, Color.RED, 0));
    const G: MosaicGameState = client.store.getState().G;
    expect(G.boards[1].rows[0]).toEqual({ maxSize: 1, red: 1 });
    expect(G.boards[1].penaltyRow).toEqual([Color.PENALTY]);
    expect(G.centerBucket).toEqual({ red: 0, blue: 1, yellow: 0, green: 0, black: 0 });
  });

  it('should move from restricted bucket to penalty row correctly', () => {
    const client = Client({
      game: { ...MosaicGame, seed: 1 },
      numPlayers: 2,
    });

    // First restricted: {"maxSize":4,"black":2,"red":1,"blue":1}
    client.moves.move(makeMove(0, Color.BLACK, -1));
    const G: MosaicGameState = client.store.getState().G;
    expect(G.boards[0].penaltyRow).toEqual([Color.BLACK, Color.BLACK]);
    expect(getBucketSize(G.restrictedBuckets[0])).toEqual(0);
    expect(G.centerBucket).toEqual({ penalty: 1, red: 1, blue: 1, yellow: 0, green: 0, black: 0 });
  });

  it('should play a full turn correctly', () => {
    const client = Client({
      game: { ...MosaicGame, seed: 1 },
      numPlayers: 2,
    });

    client.moves.move(makeMove(0, Color.BLACK, 1));
    client.moves.move(makeMove(1, Color.YELLOW, 2));
    client.moves.move(makeMove(2, Color.RED, 0));
    client.moves.move(makeMove(3, Color.BLACK, 1));
    client.moves.move(makeMove(-1, Color.BLUE, 3));
    client.moves.move(makeMove(4, Color.GREEN, 0));
    client.moves.move(makeMove(-1, Color.RED, 2));
    client.moves.move(makeMove(-1, Color.GREEN, 4));
    client.moves.move(makeMove(-1, Color.YELLOW, 4));
    client.moves.move(makeMove(-1, Color.BLACK, 3));
    client.moves.move(makeMove(-1, Color.BLUE, -1));
    const G: MosaicGameState = client.store.getState().G;
    expect(G.boards[0].points).toEqual(1);
    expect(G.boards[1].points).toEqual(4);
  });

  it('should play final turn and end the game correctly', () => {
    const initialState: MosaicGameState = {
      boards: [
        {
          ...DEFAULT_BOARD,
          board: [
            [Color.NONE, Color.YELLOW, Color.RED, Color.BLACK, Color.GREEN],
            [Color.NONE, Color.BLUE, Color.YELLOW, Color.RED, Color.BLACK],
            [Color.BLACK, Color.GREEN, Color.BLUE, Color.NONE, Color.NONE],
            [Color.NONE, Color.NONE, Color.GREEN, Color.BLUE, Color.YELLOW],
            [Color.NONE, Color.NONE, Color.BLACK, Color.NONE, Color.BLUE],
          ],
        },
        { ...DEFAULT_BOARD },
      ],
      boardTemplate: DEFAULT_TEMPLATE,
      bag: {},
      secondaryBag: {},
      centerBucket: { blue: 1, green: 1, red: 1 },
      restrictedBuckets: [{}],
    };
    const client = Client({
      game: {
        ...MosaicGame,
        seed: 1,
        setup: () => initialState,
      },
      numPlayers: 2,
    });

    client.moves.move(makeMove(-1, Color.BLUE, 0));
    client.moves.move(makeMove(-1, Color.RED, 0));
    client.moves.move(makeMove(-1, Color.GREEN, 1));
    const state = client.store.getState();
    expect(state.G.boards[0].points).toEqual(24);
    expect(state.G.boards[1].points).toEqual(1);
    expect(state.ctx.gameover).toEqual({ winner: '0' });
  });
});
