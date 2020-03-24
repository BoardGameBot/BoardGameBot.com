import { TictactoeGameState } from '../game';
import { createCanvas, Canvas } from 'canvas';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { ijToCoord } from '../util';
import { fillBackground } from '../../../util';

export class BoardRenderer {
  canvas: Canvas;
  roughCanvas: RoughCanvas;
  seed: number;

  constructor(seed?: number) {
    this.seed = seed ? seed : rough.newSeed();
    this.canvas = createCanvas(300, 300);
    this.roughCanvas = rough.canvas(this.canvas as any, { options: { seed: this.seed } });
  }

  render(state: TictactoeGameState, lastPlayedCell?: number, winningCells?: number[]) {
    fillBackground(this.canvas);
    this.drawInitialLines();
    this.drawCells(state, lastPlayedCell, winningCells);
    return this.canvas.toBuffer();
  }

  drawInitialLines() {
    this.roughCanvas.line(100, 5, 100, 295, { strokeWidth: 2 });
    this.roughCanvas.line(200, 5, 200, 295, { strokeWidth: 2 });
    this.roughCanvas.line(5, 100, 295, 100, { strokeWidth: 2 });
    this.roughCanvas.line(5, 200, 295, 200, { strokeWidth: 2 });
    this.roughCanvas.line(5, 100, 295, 100, { strokeWidth: 2 });
  }

  drawCells(state: TictactoeGameState, lastPlayedCell?: number, winningCells?: number[]) {
    const canvasCtx = this.canvas.getContext('2d');
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const index = 3 * j + i;
        const boldCell = index === lastPlayedCell || (winningCells && winningCells.includes(index));
        canvasCtx.save();
        canvasCtx.translate(100 * i + 50, 100 * j + 50);
        if (state.cells[index] === '0') {
          this.drawCross(80, boldCell);
        } else if (state.cells[index] === '1') {
          this.drawCircle(80, boldCell);
        } else {
          this.drawCoord(canvasCtx, ijToCoord(i, j));
        }
        canvasCtx.restore();
      }
    }
  }

  drawCross(size: number, lastPlayedCell: boolean) {
    const strokeWidth = lastPlayedCell ? 0.12 * size : 0.05 * size;
    this.roughCanvas.line(
      -0.5 * size, // x1
      -0.5 * size, // y1
      0.5 * size, // x2
      0.5 * size, // y2
      { stroke: 'red', strokeWidth },
    );
    this.roughCanvas.line(
      0.5 * size, // x1
      -0.5 * size, // y1
      -0.5 * size, // x2
      0.5 * size, // y2
      { stroke: 'red', strokeWidth },
    );
  }

  drawCircle(size: number, lastPlayedCell: boolean) {
    const strokeWidth = lastPlayedCell ? 0.12 * size : 0.05 * size;
    this.roughCanvas.circle(
      0, // x
      0, // y
      size, // diameter
      { stroke: 'green', strokeWidth },
    );
  }

  drawCoord(canvasCtx, coord: string) {
    canvasCtx.font = '30px Comic Sans MS';
    canvasCtx.fillStyle = 'grey';
    canvasCtx.textAlign = 'center';
    canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(coord, 0, 0);
  }
}
