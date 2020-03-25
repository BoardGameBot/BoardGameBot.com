import assert from 'assert';
const ROWS = ['A', 'B', 'C'];

export function ijToCoord(i: number, j: number): string {
  const letter = ROWS[j];
  return `${letter}${i + 1}`;
}

export function coordToCell(coord: string) {
  assert(coord.length === 2);
  const j = ROWS.indexOf(coord[0]);
  const i = Number(coord[1]) - 1;
  return 3 * j + i;
}

export function isValidCoord(coord: string) {
  const row = coord[0].toUpperCase();
  const column = Number(coord[1]);
  return coord.length === 2 && ROWS.indexOf(row) !== -1 && column >= 1 && column <= 3;
}
