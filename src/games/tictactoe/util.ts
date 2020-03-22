const ROWS = ['A', 'B', 'C'];

export function ijToCoord(i: number, j: number): string {
  const letter = ROWS[j];
  return `${letter}${i + 1}`;
}
