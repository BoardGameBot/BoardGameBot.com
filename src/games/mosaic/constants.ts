import { Color, Bucket, Board, BoardTemplate } from './definitions';

export const DEFAULT_TEMPLATE: BoardTemplate = {
  template: [
    [Color.BLUE, Color.YELLOW, Color.RED, Color.BLACK, Color.GREEN],
    [Color.GREEN, Color.BLUE, Color.YELLOW, Color.RED, Color.BLACK],
    [Color.BLACK, Color.GREEN, Color.BLUE, Color.YELLOW, Color.RED],
    [Color.RED, Color.BLACK, Color.GREEN, Color.BLUE, Color.YELLOW],
    [Color.YELLOW, Color.RED, Color.BLACK, Color.GREEN, Color.BLUE],
  ],
};

export const PENALTY_ROW_SIZE = 7;

export const DEFAULT_BOARD: Board = {
  rows: [{ maxSize: 1 }, { maxSize: 2 }, { maxSize: 3 }, { maxSize: 4 }, { maxSize: 5 }],
  board: [
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
    [Color.NONE, Color.NONE, Color.NONE, Color.NONE, Color.NONE],
  ],
  penaltyRow: [],
  points: 0,
};

export const DEFAULT_BAG: Bucket = {
  red: 20,
  yellow: 20,
  black: 20,
  blue: 20,
  green: 20,
};

export const COLOR_ARRAY = [Color.RED, Color.YELLOW, Color.BLACK, Color.BLUE, Color.GREEN];
