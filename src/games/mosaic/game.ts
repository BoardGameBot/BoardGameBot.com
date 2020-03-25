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
  buckets: Bucket[];
  centerBucket: Bucket;
  points: number[]; // Length is the # of players
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
};

export const DEFAULT_BAG: Bucket = {
  red: 20,
  yellow: 20,
  black: 20,
  blue: 20,
  green: 20,
};
