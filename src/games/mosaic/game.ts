import { GameConfig, INVALID_MOVE } from 'boardgame.io/core';
import { DEFAULT_BAG, DEFAULT_TEMPLATE, DEFAULT_BOARD } from './constants';
import { MosaicGameState, Bucket, MoveDetails, Board, RowType, BucketType } from './definitions';
import {
  withdrawFromBag,
  getOriginBucketForMove,
  moveToPenaltyRow,
  transferAllTiles,
  maybeMovePenaltyToken,
  validMoveOrigin,
  validMoveDestination,
  moveToNormalRow,
  getAvailableTilesCount,
  isGameOver,
  getWinner,
  placeTilesAndScore,
  applyFinalScore,
  drawMoreTiles,
  processPenalty,
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

  turn: { moveLimit: 1 },
  moves: {
    move: (G: MosaicGameState, ctx, move: MoveDetails) => {
      if (!validMoveOrigin(G, move).status || !validMoveDestination(G, ctx, move).status) {
        return INVALID_MOVE;
      }
      if (move.bucketType == BucketType.CENTER) {
        maybeMovePenaltyToken(G, ctx);
      }
      const origin = getOriginBucketForMove(G, move);
      const board = G.boards[parseInt(ctx.currentPlayer)];
      if (move.rowType == RowType.NORMAL) {
        moveToNormalRow(G, origin, board, move);
      } else if (move.rowType == RowType.PENALTY) {
        moveToPenaltyRow(G, board, origin, move);
      }
      transferAllTiles(origin, G.centerBucket);
      if (getAvailableTilesCount(G) === 0) {
        board.newPointsExplanation = [];
        placeTilesAndScore(G);
        processPenalty(G);
        if (isGameOver(G)) {
          applyFinalScore(G);
          const winner = `${getWinner(G)}`;
          ctx.events.endGame({ winner });
        } else {
          drawMoreTiles(G, ctx);
        }
      }
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
