import { COLOR_ARRAY, PENALTY_ROW_SIZE } from './constants';
import { Bucket, Color, MoveDetails, BucketType, MosaicGameState, Board, IsValid, RowType } from './definitions';

/** Gets how many tiles of a given color in given bucket. */
export function getColorCount(bucket: Bucket, color: Color) {
  if (color in bucket) {
    return bucket[color];
  } else {
    return 0;
  }
}

/** Gets how many tiles in given bucket. */
export function getBucketSize(bucket: Bucket) {
  let size = 0;
  for (const color of COLOR_ARRAY) {
    size += getColorCount(bucket, color);
  }
  return size;
}

/** Adds "count" tiles of given color to bucket. */
export function transferTiles(origin: Bucket, dest: Bucket, color: Color, count: number) {
  origin[color] = getColorCount(origin, color) - count;
  dest[color] = getColorCount(dest, color) + count;
}

/** Transfers all tiles from one bucket to another. */
export function transferAllTiles(origin: Bucket, dest: Bucket) {
  for (const color of COLOR_ARRAY) {
    const originCount = getColorCount(origin, color);
    transferTiles(origin, dest, color, originCount);
  }
}

/** Withdraws "count" tiles from bag(s) into bucket. */
export function withdrawFromBag(ctx, bag: Bucket, secondaryBag: Bucket, dest: Bucket, count = 4) {
  const bagSize = getBucketSize(bag);
  if (bagSize < count) {
    transferAllTiles(secondaryBag, bag);
  }
  let allTiles: Color[] = [];
  for (const color of COLOR_ARRAY) {
    for (let i = 0; i < bag[color]; i++) {
      allTiles.push(color);
    }
  }
  allTiles = ctx.random.Shuffle(allTiles);
  for (let i = 0; i < count; i++) {
    const color = allTiles[i];
    transferTiles(bag, dest, color, 1);
  }
}

/** Returns correct origin Bucket for given move. */
export function getOriginBucketForMove(G: MosaicGameState, move: MoveDetails): Bucket {
  if (move.bucketType == BucketType.CENTER) {
    return G.centerBucket;
  } else {
    return G.restrictedBuckets[move.bucketIndex];
  }
}

/** Process a move that goes to penalty row. */
export function moveToPenaltyRow(G: MosaicGameState, board: Board, origin: Bucket, move: MoveDetails) {
  const currentLength = board.penaltyRow.length;
  const originCount = getColorCount(origin, move.color);
  const discardedCount = Math.max(0, currentLength + originCount - PENALTY_ROW_SIZE);
  const appliedCount = originCount - discardedCount;
  for (let i = 0; i < appliedCount; i++) {
    board.penaltyRow.push(move.color);
    origin[move.color]--;
  }
  transferTiles(origin, G.secondaryBag, move.color, discardedCount);
}

/** Executes move to normal row. */
export function moveToNormalRow(G: MosaicGameState, origin: Bucket, board: Board, move: MoveDetails) {
  const originCount = getColorCount(origin, move.color);
  const dest = board.rows[move.rowIndex];
  const actuallyMoved = Math.min(originCount, dest.maxSize - getBucketSize(dest));
  transferTiles(origin, dest, move.color, actuallyMoved);
  moveToPenaltyRow(G, board, origin, move);
}

/** Maybe moves the penalty token from the center to the user's board. */
export function maybeMovePenaltyToken(G: MosaicGameState, ctx) {
  if (G.centerBucket.penalty === 1) {
    G.boards[parseInt(ctx.currentPlayer)].penaltyRow.push(Color.PENALTY);
    G.centerBucket.penalty = undefined;
  }
}

/** Checks if move has valid origin. */
export function validMoveOrigin(G: MosaicGameState, move: MoveDetails): IsValid {
  if (
    move.bucketType === BucketType.RESTRICTED &&
    !(move.bucketIndex >= 0 && move.bucketIndex < G.restrictedBuckets.length)
  ) {
    return { status: false, reason: 'Invalid origin selection.' };
  }
  const origin = getOriginBucketForMove(G, move);
  const originCount = getColorCount(origin, move.color);
  if (originCount == 0) {
    return { status: false, reason: 'Origin does not have this color available' };
  }
  return { status: true };
}

/** Whether row has a given color or not. */
export function boardRowHasColor(row: Color[], color: Color) {
  for (const colColor of row) {
    if (colColor == color) {
      return true;
    }
  }
  return false;
}

/** Checks if move has valid origin. */
export function validMoveDestination(G: MosaicGameState, ctx, move: MoveDetails): IsValid {
  const board = G.boards[parseInt(ctx.currentPlayer)];
  if (move.rowType == RowType.NORMAL) {
    if (!(move.rowIndex >= 0 && move.rowIndex <= 4)) {
      return { status: false, reason: 'Invalid row selection.' };
    }
    const dest = board.rows[move.rowIndex];
    const currentTotalSize = getBucketSize(dest);
    if (dest.maxSize === currentTotalSize) {
      return { status: false, reason: 'No empty space in this row.' };
    }
    const currentColorSize = getColorCount(dest, move.color);
    if (currentColorSize != currentTotalSize) {
      return { status: false, reason: 'Row can only have one color at a time.' };
    }
    const boardRow = board.board[move.rowIndex];
    if (boardRowHasColor(boardRow, move.color)) {
      return { status: false, reason: 'This color is already placed on the board.' };
    }
  }
  return { status: true };
}
