import { getColorCount, getBucketSize, addToBucket, transferAllTiles, withdrawFromBag } from './util';
import { Bucket, Color } from './definitions';

describe('Mosaic Util', () => {
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

  it('should give correct bucket size', () => {
    const bucket: Bucket = {
      red: 2,
      green: 0,
      blue: 1,
    };

    const result = getBucketSize(bucket);

    expect(result).toEqual(3);
  });

  it('should add correctly to Bucket', () => {
    const bucket: Bucket = {
      red: 2,
      green: 0,
      blue: 1,
    };

    addToBucket(bucket, Color.BLACK, 3);

    expect(bucket).toEqual({
      red: 2,
      green: 0,
      blue: 1,
      black: 3,
    });
  });

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
        Shuffle: () => {
          /* do nothing*/ return;
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
        Shuffle: () => {
          /* do nothing*/ return;
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
