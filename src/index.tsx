// @deno-types="npm:@types/p5"
import p5 from "p5";
import {RESOLUTION, FRAME_RATE, DEAD, ALIVE} from "./constants";

const root = document.getElementById('root')

const sketch = (p: p5) => {

  let cols: number;
  let rows: number;
  const backgroundColor = p.color("#0c0a09");
  const liveCellColor = p.color("#22c55e");
  const borderColor = p.color("#292524");

  /**
   * create 2D array
   */
  function make2DArray(cols: number, rows: number): number[][] {
    console.log(cols, rows);
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  /**
   * count live neighbors of a specific cell
   */
  function countNeighbors(grid: number[][], x: number, y: number): number {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {

        const col = (x + i + cols) % cols;
        const row = (y + i + rows) % rows;

        sum += grid[col][row];
      }
    }
    // don't count itself
    sum -= grid[x][y];
    return sum;
  }

  let grid: number[][];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FRAME_RATE);

    cols = Math.floor(p.width / RESOLUTION);
    rows = Math.floor(p.height / RESOLUTION);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.floor(2 * Math.random());
      }
    }
  };

  p.draw = () => {
    p.background(backgroundColor);

    // display grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * RESOLUTION;
        const y = j * RESOLUTION;

        if (grid[i][j] == 1) {
          p.fill(liveCellColor);
          p.stroke(borderColor);
          p.rect(x, y, RESOLUTION - 1, RESOLUTION - 1);
        }
      }
    }

    let next = make2DArray(cols, rows);

    // calculate next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // get current state
        const state = grid[i][j];

        // count live neighbors
        const neighbors = countNeighbors(grid, i, j);

        if (state == DEAD && neighbors == 3) {
          next[i][j] = ALIVE;
        } else if (state == ALIVE && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = DEAD;
        } else {
          next[i][j] = state;
        }
      }
    }

    grid = next;
  };

  p.mouseClicked = () => {
    if (p.isLooping()) {
      p.noLoop();
    } else {
      p.loop();
    }
  }
};

new p5(sketch, root!);