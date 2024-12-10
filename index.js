const clivas = require("clivas");
const keypress = require("keypress");

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

// ぷよの色たち
const color = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
// フィールドの大きさ
const HEIGHT = 10;
const WIDTH = 5;
// enum key移動
const MOVE = Object.freeze({
  LEFT: {x: -1, y: 0, check: (x) => x > 0},
  RIGHT: {x: 1, y: 0, check: (x) => x < WIDTH - 1},
});

clivas.cursor(false);
clivas.pin(HEIGHT);

const randomColor = () => color[Math.floor(Math.random() * color.length)];

let fields = new Array(WIDTH).fill("").map(() => new Array(HEIGHT).fill("."));

// 移動処理
const keypressMove = (move) => {
  const isMoved = new Set();
  for (let column = WIDTH - 1; column >= 0; column--) {
    for (let row = HEIGHT - 1; row >= 0; row--) {
      if (fields[column][row].startsWith("ACT:")) {
        if (move.check(column)
          && !isMoved.has(`${column}:${row}`)
          && fields[column + move.x][row] === ".") {
          fields[column + move.x][row] = fields[column][row];
          fields[column][row] = ".";
          isMoved.add(`${column + move.x}:${row}`);
        }
      }
    }
  }
};

// 落ちる処理
const fall = (fields) => {
  for (let column = WIDTH - 1; column >= 0; column--) {
    for (let row = HEIGHT - 1; row >= 0; row--) {
      if (fields[column][row].startsWith("ACT:")) {
        if (
          row + 1 === HEIGHT ||
          (fields[column][row + 1] !== "." &&
            !fields[column][row + 1].startsWith("ACT:"))
        ) {
          // もう落ちれない ACT: を取り除く(一応の処理)
          fields[column][row] = fields[column][row].split(":")[1];
        } else if (
          row + 2 === HEIGHT ||
          (fields[column][row + 2] !== "." &&
            !fields[column][row + 2].startsWith("ACT:"))
        ) {
          // 1個落ちたあと、もう落ちれない ACT: を取り除く(通常時この処理に入る)
          fields[column][row + 1] = fields[column][row].split(":")[1];
          fields[column][row] = ".";
        } else {
          // まだ落ちれる
          fields[column][row + 1] = fields[column][row];
          fields[column][row] = ".";
        }
      }
    }
  }
  return fields;
};

const draw = (isFall) => {
  clivas.clear();

  if (isFall) {
    // すでに落ちているものがない場合
    if (
      !fields.some((column) => column.some((row) => row.startsWith("ACT:")))
    ) {
      // 落とす処理
      fields[2][0] = `ACT:${randomColor()}`;
      fields[2][1] = `ACT:${randomColor()}`;
    } else {
      // 落ちる処理
      fields = fall(fields);
    }
  }

  // 行と列を入れ替える
  const fields2 = new Array(HEIGHT)
    .fill("")
    .map(() => new Array(WIDTH).fill("."));
  for (let column = 0; column < WIDTH; column++) {
    for (let row = 0; row < HEIGHT; row++) {
      fields2[row][column] = fields[column][row];
    }
  }

  // 実描画
  clivas.line("{white:┌──────────┐}");
  for (const row of fields2) {
    clivas.write("{white:│}");
    for (const column of row) {
      if (column === ".") {
        clivas.write("{2}");
      } else if (column.startsWith("ACT:")) {
        clivas.write(`{2+${column.split(":")[1]}:●}`);
      } else {
        clivas.write(`{2+${column}:●}`);
      }
    }
    clivas.write("{white:│}\n");
  }
  clivas.line("{white:└──────────┘}");
};

let flame = 0;
setInterval(function () {
  draw(true);
  flame++;
}, 800);

process.stdin.on("keypress", (ch, key) => {
  if (key && key.name === "return") {
    return;
  }
  if (key && key.ctrl && key.name === "c") {
    process.exit();
  }
  if (key.name === "left") {
    // move left
    keypressMove(MOVE.LEFT);
  }
  if (key.name === "right") {
    // move right
    keypressMove(MOVE.RIGHT);
  }
  if (key.name === "down") {
    // move down
  }
  if (key.name === "up") {
    // rotate
  }
  draw(false);
});
