import assert from 'assert';
const ROWS = ['A', 'B', 'C'];

export function ijToCoord(i: number, j: number): string {
  const letter = ROWS[j];
  return `${letter}${i + 1}`;
}

export function coordToIj(coord: string) {
  assert(coord.length === 2);
  const j = ROWS.indexOf(coord[0]);
  const i = Number(coord[1]) - 1;
  return [i, j];
}

export function ijToCell(i: number, j: number) {
  return 3 * j + i;
}

export function isValidCoord(coord: string) {
  return coord.length === 2 && ROWS.indexOf(coord[0]) !== -1 && Number(coord[1]) <= 3;
}
