import { ijToCoord } from './util';

describe('TicTacToe Util', () => {
  it('should give correct coordinate from ij', () => {
    expect(ijToCoord(0, 1)).toEqual('B1');
  });
});
