import { COLOR_ARRAY } from './constants';
import { Bucket, Color } from './definitions';

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
export function addToBucket(bucket: Bucket, color: Color, count: number) {
  const previousCount = getColorCount(bucket, color);
  bucket[color] = previousCount + count;
}

/** Transfers all tiles from one bucket to another. */
export function transferAllTiles(origin: Bucket, dest: Bucket) {
  for (const color of COLOR_ARRAY) {
    const originCount = getColorCount(origin, color);
    origin[color] = 0;
    addToBucket(dest, color, originCount);
  }
}

/** Withdraws "count" tiles from bag(s) into bucket. */
export function withdrawFromBag(ctx, bag: Bucket, secondaryBag: Bucket, dest: Bucket, count = 4) {
  const bagSize = getBucketSize(bag);
  if (bagSize < count) {
    transferAllTiles(secondaryBag, bag);
  }
  const allTiles: Color[] = [];
  for (const color of COLOR_ARRAY) {
    for (let i = 0; i < bag[color]; i++) {
      allTiles.push(color);
    }
  }
  ctx.random.Shuffle(allTiles);
  for (let i = 0; i < count; i++) {
    const color = allTiles[i];
    addToBucket(dest, color, 1);
    addToBucket(bag, color, -1);
  }
}
