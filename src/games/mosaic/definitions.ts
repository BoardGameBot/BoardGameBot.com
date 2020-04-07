export enum Color {
  NONE = 'none',
  RED = 'red',
  YELLOW = 'yellow',
  BLACK = 'black',
  BLUE = 'blue',
  GREEN = 'green',
  PENALTY = 'penalty',
}

export type Coord = [number, number];

export interface BoardTemplate {
  template: Color[][]; // 5x5 board template
}

export interface Board {
  rows: Bucket[];
  board: Color[][]; // 5x5 board template
  penaltyRow: Color[];
  points: number;
  newPointsExplanation?: NewPointsExplanation[];
}

export interface Bucket {
  maxSize?: number;
  red?: number;
  yellow?: number;
  black?: number;
  blue?: number;
  green?: number;
  penalty?: number;
}

export enum PointsExplanation {
  NEW_TILE_NEIGHBORS,
  VERTICAL_LINES,
  HORIZONTAL_LINES,
  ALL_TILES_FROM_COLOR
}

export interface NewPointsExplanation {
  points: number;
  explanation: PointsExplanation;
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
  secondaryBag: Bucket;
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

export interface IsValid {
  status: boolean;
  reason?: string;
}
