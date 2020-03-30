import { Client } from 'boardgame.io/client';
import { MosaicGame } from './game';
import { MosaicGameState, MoveDetails, BucketType, Color, RowType } from './definitions';
import { getBucketSize } from './util';

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
    const move: MoveDetails = {
      bucketType: BucketType.RESTRICTED,
      bucketIndex: 0,
      color: Color.BLACK,
      rowType: RowType.NORMAL,
      rowIndex: 4,
    };
    client.moves.buyTiles(move);
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
    const firstMove: MoveDetails = {
      bucketType: BucketType.RESTRICTED,
      bucketIndex: 0,
      color: Color.BLACK,
      rowType: RowType.NORMAL,
      rowIndex: 4,
    };
    client.moves.buyTiles(firstMove);
    const secondMove: MoveDetails = {
      bucketType: BucketType.CENTER,
      color: Color.RED,
      rowType: RowType.NORMAL,
      rowIndex: 0,
    };
    client.moves.buyTiles(secondMove);
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
    const move: MoveDetails = {
      bucketType: BucketType.RESTRICTED,
      bucketIndex: 0,
      color: Color.BLACK,
      rowType: RowType.PENALTY,
    };
    client.moves.buyTiles(move);
    const G: MosaicGameState = client.store.getState().G;
    expect(G.boards[0].penaltyRow).toEqual([Color.BLACK, Color.BLACK]);
    expect(getBucketSize(G.restrictedBuckets[0])).toEqual(0);
    expect(G.centerBucket).toEqual({ penalty: 1, red: 1, blue: 1, yellow: 0, green: 0, black: 0 });
  });
});
