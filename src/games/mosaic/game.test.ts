import { Client } from 'boardgame.io/client';
import { MosaicGame } from './game';
import { MosaicGameState } from './definitions';
import { getBucketSize } from './util';

describe('Mosaic Game Rules', () => {
  it('should initialize a 3 player game correctly', () => {
    const client = Client({
      game: MosaicGame,
      numPlayers: 3,
    });

    const G: MosaicGameState = client.store.getState().G;

    expect(G.boards.length).toEqual(3);
    expect(G.restrictedBuckets.length).toEqual(7);
    expect(getBucketSize(G.restrictedBuckets[0])).toEqual(4);
  });
});
