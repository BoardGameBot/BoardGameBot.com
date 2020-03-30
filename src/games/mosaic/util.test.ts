import {
  getColorCount,
  getBucketSize,
  transferTiles,
  transferAllTiles,
  withdrawFromBag,
  moveToPenaltyRow,
  maybeMovePenaltyToken,
  validMoveOrigin,
  validMoveDestination,
} from './util';
import { Bucket, Color, MosaicGameState, MoveDetails, BucketType, RowType } from './definitions';
import { DEFAULT_BOARD, DEFAULT_TEMPLATE } from './constants';

describe('Mosaic Util', () => {
  describe('getColorCount()', () => {
    it('should give correct color count for existing color', () => {
      const bucket: Bucket = {
        red: 2,
        green: 0,
        blue: 1,
      };

      const result = getColorCount(bucket, Color.RED);

      expect(result).toEqual(2);
    });

    it('should give correct color count for non-existing color', () => {
      const bucket: Bucket = {
        red: 2,
        green: 0,
        blue: 1,
      };

      const result = getColorCount(bucket, Color.BLACK);

      expect(result).toEqual(0);
    });
  });

  describe('getBucketSize()', () => {
    it('should give correct bucket size', () => {
      const bucket: Bucket = {
        red: 2,
        green: 0,
        blue: 1,
      };

      const result = getBucketSize(bucket);

      expect(result).toEqual(3);
    });
  });

  describe('transferTiles()', () => {
    it('should transfer correctly between Buckets', () => {
      const origin: Bucket = {
        red: 2,
        green: 0,
        blue: 1,
      };
      const dest: Bucket = {
        red: 1,
      };

      transferTiles(origin, dest, Color.RED, 1);

      expect(origin).toEqual({
        red: 1,
        green: 0,
        blue: 1,
      });
      expect(dest).toEqual({
        red: 2,
      });
    });
  });

  describe('transferAllTiles()', () => {
    it('should transfer all tiles from one bucket to another', () => {
      const origin: Bucket = {
        red: 2,
        green: 0,
        blue: 1,
      };
      const dest: Bucket = {
        blue: 1,
        black: 2,
      };

      transferAllTiles(origin, dest);

      expect(origin).toEqual({
        black: 0,
        red: 0,
        green: 0,
        blue: 0,
        yellow: 0,
      });
      expect(dest).toEqual({
        red: 2,
        green: 0,
        blue: 2,
        black: 2,
        yellow: 0,
      });
    });
  });

  describe('moveToPenaltyRow()', () => {
    it('should move correctly to penalty row', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
            penaltyRow: [Color.GREEN, Color.BLUE, Color.RED, Color.YELLOW],
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: { red: 6 },
        restrictedBuckets: [],
      };
      const move: MoveDetails = {
        bucketType: BucketType.CENTER,
        color: Color.RED,
        rowType: RowType.PENALTY,
      };

      moveToPenaltyRow(fakeG, fakeG.boards[0], fakeG.centerBucket, move);

      expect(fakeG.centerBucket).toEqual({ red: 0 });
      expect(fakeG.boards[0].penaltyRow).toEqual([
        Color.GREEN,
        Color.BLUE,
        Color.RED,
        Color.YELLOW,
        Color.RED,
        Color.RED,
        Color.RED,
      ]);
      expect(fakeG.secondaryBag).toEqual({
        red: 3,
      });
    });
  });

  describe('validMoveOrigin()', () => {
    it('should return valid move', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.RED,
        rowType: RowType.PENALTY,
      };

      const result = validMoveOrigin(fakeG, move);

      expect(result.status).toEqual(true);
    });

    it('should not allow selected invalid bucket', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 1,
        color: Color.RED,
        rowType: RowType.PENALTY,
      };

      const result = validMoveOrigin(fakeG, move);

      expect(result.status).toEqual(false);
      expect(result.reason).toContain('Invalid origin');
    });

    it('should not allow selected invalid color', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.BLACK,
        rowType: RowType.PENALTY,
      };

      const result = validMoveOrigin(fakeG, move);

      expect(result.status).toEqual(false);
      expect(result.reason).toContain('Origin does not have this color');
    });
  });

  describe('validMoveDestination()', () => {
    it('should have valid row selection', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      const ctx = {
        currentPlayer: '0',
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.RED,
        rowType: RowType.PENALTY,
      };

      const result = validMoveDestination(fakeG, ctx, move);

      expect(result.status).toEqual(true);
    });

    it('should show invalid selection', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      const ctx = {
        currentPlayer: '0',
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.RED,
        rowType: RowType.NORMAL,
        rowIndex: 6,
      };

      const result = validMoveDestination(fakeG, ctx, move);

      expect(result.status).toEqual(false);
      expect(result.reason).toContain('Invalid row');
    });

    it('should not allow selecting row without space', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      fakeG.boards[0].rows[0].red = 1;
      const ctx = {
        currentPlayer: '0',
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.RED,
        rowType: RowType.NORMAL,
        rowIndex: 0,
      };

      const result = validMoveDestination(fakeG, ctx, move);

      expect(result.status).toEqual(false);
      expect(result.reason).toContain('No empty space');
    });

    it('should not allow more than one color in a row', () => {
      const fakeG: MosaicGameState = {
        boards: [
          {
            ...DEFAULT_BOARD,
          },
        ],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [{ red: 4 }],
      };
      fakeG.boards[0].rows[1].green = 1;
      const ctx = {
        currentPlayer: '0',
      };
      const move: MoveDetails = {
        bucketType: BucketType.RESTRICTED,
        bucketIndex: 0,
        color: Color.RED,
        rowType: RowType.NORMAL,
        rowIndex: 1,
      };

      const result = validMoveDestination(fakeG, ctx, move);

      expect(result.status).toEqual(false);
      expect(result.reason).toContain('can only have one color');
    });
  });

  describe('maybeMovePenaltyToken()', () => {
    it('should move correctly penalty token', () => {
      const fakeG: MosaicGameState = {
        boards: [{ ...DEFAULT_BOARD, penaltyRow: [] }],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: { penalty: 1 },
        restrictedBuckets: [],
      };
      const fakeCtx = { currentPlayer: '0' };

      maybeMovePenaltyToken(fakeG, fakeCtx);

      expect(fakeG.centerBucket).toEqual({});
      expect(fakeG.boards[0].penaltyRow).toEqual([Color.PENALTY]);
    });

    it('should NOT move penalty token', () => {
      const fakeG: MosaicGameState = {
        boards: [{ ...DEFAULT_BOARD, penaltyRow: [] }],
        boardTemplate: DEFAULT_TEMPLATE,
        bag: {},
        secondaryBag: {},
        centerBucket: {},
        restrictedBuckets: [],
      };
      const fakeCtx = { currentPlayer: '0' };

      maybeMovePenaltyToken(fakeG, fakeCtx);

      expect(fakeG.centerBucket).toEqual({});
      expect(fakeG.boards[0].penaltyRow).toEqual([]);
    });
  });

  describe('withdrawFromBag()', () => {
    it('should withdraw from primary bag', () => {
      const primaryBag: Bucket = {
        red: 1,
        blue: 2,
        green: 2,
      };
      const secondaryBag: Bucket = {};

      const dest: Bucket = {
        maxSize: 4,
      };
      const fakeCtx = {
        random: {
          Shuffle: x => {
            return x;
          },
        },
      };

      withdrawFromBag(fakeCtx, primaryBag, secondaryBag, dest);

      expect(dest).toEqual({
        maxSize: 4,
        red: 1,
        blue: 2,
        green: 1,
      });
    });

    it('should withdraw from primary and secondary bag', () => {
      const primaryBag: Bucket = {
        red: 1,
      };
      const secondaryBag: Bucket = {
        blue: 2,
        green: 2,
      };

      const dest: Bucket = {
        maxSize: 4,
      };
      const fakeCtx = {
        random: {
          Shuffle: x => {
            return x;
          },
        },
      };

      withdrawFromBag(fakeCtx, primaryBag, secondaryBag, dest);

      expect(dest).toEqual({
        maxSize: 4,
        red: 1,
        blue: 2,
        green: 1,
      });
    });
  });
});
