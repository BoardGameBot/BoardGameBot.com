import { GameConfig } from 'boardgame.io/core';

export enum Color {
  NONE,
  RED,
  YELLOW,
  BLACK,
  BLUE,
  GREEN,
}

export interface BoardTemplate {
  template: Color[][]; // 5x5 board template
}

export interface Board {
  rows: Bucket[];
  board: Color[][]; // 5x5 board template
  penaltyRow: Color[];
  points: number;
}

export interface Bucket {
  maxSize?: number;
  red?: number;
  yellow?: number;
  black?: number;
  blue?: number;
  green?: number;
}

export interface MosaicGameState {
  boards: Board[];
  boardTemplate: BoardTemplate;
  bag: Bucket;
  // Players | # Buckets
  // --------|----------
  // 2       | 5
  // 3       | 7
  // 4       | 9
  restrictedBuckets: Bucket[];
  centerBucket: Bucket;
}

export enum BucketType {
  CENTER,
  RESTRICTED,
}

export enum RowType {
  NORMAL,
  PENALTY,
}

export interface MoveDetails {
  bucketType: BucketType;
  bucketIndex?: number;
  color: Color;
  rowType: RowType;
  rowIndex?: number;
}
export const DEFAULT_TEMPLATE: BoardTemplate = {
  template: [
    [Color.BLUE, Color.YELLOW, Color.RED, Color.BLACK, Color.GREEN],
    [Color.GREEN, Color.BLUE, Color.YELLOW, Color.RED, Color.BLACK],
    [Color.BLACK, Color.GREEN, Color.BLUE, Color.YELLOW, Color.RED],
    [Color.RED, Color.BLACK, Color.GREEN, Color.BLUE, Color.YELLOW],
    [Color.YELLOW, Color.RED, Color.BLACK, Color.GREEN, Color.BLUE],
  ],
};

export const DEFAULT_BOARD: Board = {
  rows: [{ maxSize: 1 }, { maxSize: 2 }, { maxSize: 3 }, { maxSize: 4 }, { maxSize: 5 }],
  board: [
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
  ],
  penaltyRow: [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
  points: 0,
};

export const DEFAULT_BAG: Bucket = {
  red: 20,
  yellow: 20,
  black: 20,
  blue: 20,
  green: 20,
};

function createBoards(numPlayers: number): Board[] {
  const boards: Board[] = [];
  for (let p = 0; p < numPlayers; p++) {
    boards.push({ ...DEFAULT_BOARD });
  }
  return boards;
}

function createBuckets(numPlayers: number): Bucket[] {
  const buckets: Bucket[] = []; // First empty bucket is the center bucket
  const totalBuckets = 1 + numPlayers * 2;
  for (let i = 0; i < totalBuckets; i++) {
    buckets.push({ maxSize: 4 });
  }
  return buckets;
}
export const MosaicGame: GameConfig = {
  name: 'mosaic',
  setup: (ctx): MosaicGameState => ({
    boards: createBoards(ctx.numPlayers),
    restrictedBuckets: createBuckets(ctx.numPlayers),
    centerBucket: {},
    boardTemplate: DEFAULT_TEMPLATE,
    bag: DEFAULT_BAG,
  }),

  moves: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    move: (G, ctx, moveDetails: MoveDetails) => {
      // TODO...
    },
  },
};
