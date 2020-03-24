import { BoardRenderer } from './BoardRenderer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('TicTacToe BoardRenderer', () => {
  it('should match golden for an in-progress game', () => {
    const renderer = new BoardRenderer(1234);
    const cells = [null, '0', '1', null, null, null, null, null, null];
    const result = renderer.render({ cells });
    expect(result).toMatchImageSnapshot();
  });

  it('should match golden for completed game', () => {
    const renderer = new BoardRenderer(1234);
    const cells = ['0', '0', '0', '1', null, '1', null, null, null];
    const result = renderer.render({ cells }, 2, [0, 1, 2]);
    expect(result).toMatchImageSnapshot();
  });
});
