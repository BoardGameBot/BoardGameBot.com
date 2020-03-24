import { BoardRenderer } from './BoardRenderer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

describe('TicTacToe BoardRenderer', () => {
  expect.extend({ toMatchImageSnapshot });
  it('should match golden', () => {
    const renderer = new BoardRenderer(1234);
    const cells = [null, '0', '1', null, null, null, null, null, null];
    const result = renderer.render({ cells });
    (expect(result) as any).toMatchImageSnapshot();
  });
});
