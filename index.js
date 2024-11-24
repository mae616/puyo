const clivas = require("clivas");
const keypress = require("keypress");

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

const color = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
const HEIGHT = 10;
const WIDTH = 5;

clivas.cursor(false);
clivas.pin(HEIGHT);

const randomColor = () => color[Math.floor(Math.random() * color.length)];

const fields = new Array(WIDTH).fill("").map(() => new Array(HEIGHT).fill("."));

fields[2][0] = "red";
fields[2][1] = "green";

const draw = () => {
  const fields2 = new Array(HEIGHT)
    .fill("")
    .map(() => new Array(WIDTH).fill("."));
  for (let column = 0; column < WIDTH; column++) {
    for (let row = 0; row < HEIGHT; row++) {
      fields2[row][column] = fields[column][row];
    }
  }

  clivas.line("{white:┌──────────┐}");
  for (const row of fields2) {
    clivas.write("{white:│}");
    for (const column of row) {
      if (column === ".") {
        clivas.write("{2}");
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
  clivas.clear();
  fields[2].pop();
  fields[2].unshift(".");
  draw();
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
  }
  if (key.name === "right") {
    // move right
  }
  if (key.name === "down") {
    // move down
  }
  if (key.name === "up") {
    // rotate
  }
  draw();
});
