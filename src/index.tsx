import p5 from "p5";

const root = document.getElementById('root')

const sketch = (p: p5) => {
  let cols: number;
  let rows: number;
  const backgroundColor = p.color("#0c0a09");
  const liveCellColor = p.color("#22c55e");
  const borderColor = p.color("#292524");
  const resolution = 50;
  const frameRate = 1;

  /**
   * 2次元配列を作成する
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
   * 特定のセルの周りの生きているセルを数える
   */
  function countNeighbors(grid: number[][], x: number, y: number): number {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {

        let col = (x + i + cols) % cols;
        let row = (y + i + rows) % rows;

        sum += grid[col][row];
      }
    }
    // 自分自身は数えない
    sum -= grid[x][y];
    return sum;
  }

  let grid: number[][];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(frameRate);

    cols = Math.floor(p.width / resolution);
    rows = Math.floor(p.height / resolution);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.floor(2 * Math.random());
      }
    }
  };

  p.draw = () => {
    p.background(backgroundColor);

    // グリッドを表示する
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;

        if (grid[i][j] == 1) {
          p.fill(liveCellColor);
          p.stroke(borderColor);
          p.rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }

    let next = make2DArray(cols, rows);

    // gird の値に基づいて次の世代の計算をする
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // 現在の状態
        let state = grid[i][j];

        // 隣り合っていて，生きているセルの数を数える
        let neighbors = countNeighbors(grid, i, j);

        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }

    grid = next;
  };
};

new p5(sketch, root!);