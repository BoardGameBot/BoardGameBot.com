import { TictactoeGameState } from "../game";
import { createCanvas, Canvas } from 'canvas';
import rough from 'roughjs';
import { RoughCanvas } from "roughjs/bin/canvas";

export class BoardRenderer {
    canvas: Canvas;
    roughCanvas: RoughCanvas;

    constructor() {
        this.canvas = createCanvas(300, 300);
        this.roughCanvas = rough.canvas(this.canvas as any);
    }

    render(state: TictactoeGameState) {
        this.drawInitialLines();
        this.drawCells(state);
        return this.canvas.toBuffer();
    }

    drawInitialLines() {
        this.roughCanvas.line(100, 0, 100, 300, { strokeWidth: 2 });
        this.roughCanvas.line(200, 0, 200, 300, { strokeWidth: 2 });
        this.roughCanvas.line(0, 100, 300, 100, { strokeWidth: 2 });
        this.roughCanvas.line(0, 200, 300, 200, { strokeWidth: 2 });
        this.roughCanvas.line(0, 100, 300, 100, { strokeWidth: 2 });
    }

    drawCells(state: TictactoeGameState) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const index = 3 * j + i;
                if (state.cells[index] === '0') {
                    this.drawCross(i, j);
                } else if (state.cells[index] === '1') {
                    this.drawCircle(i, j);
                }
            }
        }
    }

    drawCross(i: number, j: number) {
        this.roughCanvas.line(
            i * 100,       // x
            j * 100,       // y
            (i + 1) * 100, // width
            (j + 1) * 100, // height
            { stroke: 'red', strokeWidth: 3 }
        );
        this.roughCanvas.line(
            i * 100,       // x
            (j + 1) * 100, // y 
            (i + 1) * 100,      // width
            j * 100,            // height
            { stroke: 'red', strokeWidth: 3 }
        );
    }

    drawCircle(i: number, j: number) {
        this.roughCanvas.circle(
            (i + 0.5) * 100, // x
            (j + 0.5) * 100, // y 
            75,              // diameter
            { stroke: 'green', strokeWidth: 5 }
        );
    }
}