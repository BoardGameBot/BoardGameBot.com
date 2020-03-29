import { GameConfig } from 'boardgame.io/core';
import { DEFAULT_BAG, DEFAULT_TEMPLATE, DEFAULT_BOARD } from './constants';
import { MosaicGameState, Bucket, MoveDetails, Board, RowType, BucketType } from './definitions';
import {
  withdrawFromBag,
  getOriginBucketForMove,
  getColorCount,
  transferTiles,
  moveToPenaltyRow,
  transferAllTiles,
  maybeMovePenaltyToken,
} from './util';

export const MosaicGame: GameConfig = {
  name: 'mosaic',
  setup: (ctx): MosaicGameState => {
    const bag: Bucket = { ...DEFAULT_BAG };
    const secondaryBag: Bucket = {};
    return {
      boards: createBoards(ctx.numPlayers),
      restrictedBuckets: createBuckets(ctx, bag, secondaryBag),
      centerBucket: { penalty: 1 },
      boardTemplate: DEFAULT_TEMPLATE,
      bag,
      secondaryBag,
    };
  },

  moves: {
    move: (G: MosaicGameState, ctx, move: MoveDetails) => {
      if (move.bucketType == BucketType.CENTER) {
        maybeMovePenaltyToken(G, ctx);
      }
      const origin = getOriginBucketForMove(G, move);
      const originCount = getColorCount(origin, move.color);
      const board = G.boards[parseInt(ctx.currentPlayer)];
      if (move.rowType == RowType.NORMAL) {
        const dest = board.rows[move.rowIndex];
        transferTiles(origin, dest, move.color, originCount);
      } else if (move.rowType == RowType.PENALTY) {
        moveToPenaltyRow(G, board, origin, move);
      }
      transferAllTiles(origin, G.centerBucket);
      ctx.events.endTurn();
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
