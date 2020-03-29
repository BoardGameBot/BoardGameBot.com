import { GameConfig } from 'boardgame.io/core';
import { DEFAULT_BAG, DEFAULT_TEMPLATE, DEFAULT_BOARD } from './constants';
import { MosaicGameState, Bucket, MoveDetails, Board } from './definitions';
import { withdrawFromBag } from './util';

export const MosaicGame: GameConfig = {
  name: 'mosaic',
  setup: (ctx): MosaicGameState => {
    const bag: Bucket = { ...DEFAULT_BAG };
    const secondaryBag: Bucket = {};
    return {
      boards: createBoards(ctx.numPlayers),
      restrictedBuckets: createBuckets(ctx, bag, secondaryBag),
      centerBucket: {},
      boardTemplate: DEFAULT_TEMPLATE,
      bag,
      secondaryBag,
    };
  },

  moves: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    move: (G, ctx, moveDetails: MoveDetails) => {
      // TODO...
    },
  },
};

function createBoards(numPlayers: number): Board[] {
  const boards: Board[] = [];
  for (let p = 0; p < numPlayers; p++) {
    boards.push({ ...DEFAULT_BOARD });
  }
  return boards;
}

function createBuckets(ctx, bag: Bucket, secondaryBag: Bucket): Bucket[] {
  const buckets: Bucket[] = []; // First empty bucket is the center bucket
  const totalBuckets = 1 + ctx.numPlayers * 2;
  for (let i = 0; i < totalBuckets; i++) {
    const newBucket = { maxSize: 4 };
    withdrawFromBag(ctx, bag, secondaryBag, newBucket);
    buckets.push(newBucket);
  }
  return buckets;
}
