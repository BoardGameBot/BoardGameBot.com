import { ijToCoord, coordToCell, isValidCoord } from './util';

describe('TicTacToe Util', () => {
  it('should give correct coordinate from ij', () => {
    expect(ijToCoord(0, 1)).toEqual('B1');
  });

  it('should give correct i/j from coordinate', () => {
    expect(coordToCell('B1')).toEqual(3);
  });

  it('is a valid coord', () => {
    expect(isValidCoord('B1')).toBeTruthy();
    expect(isValidCoord('X1')).toBeFalsy();
    expect(isValidCoord('B9')).toBeFalsy();
    expect(isValidCoord('A')).toBeFalsy();
  });
});
