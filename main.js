let scl = 30;
let w = 810;
let h = 600;
let last;
let isalive = 1;
let scorelock = 1
let scorevalue = 0;


function randomMultiple(min, max, multiple) {
  return (
    Math.floor(Math.random() * ((max - min) / multiple + 1)) * multiple + min
  );
}

class Food {
  constructor() {
    this.spawn();
  }
  render() {
    fill(25, 25, 25);
    rect(this.x, this.y, scl, scl);
  }
  spawn() {
    this.x = randomMultiple(scl * 2, w - scl * 2, scl);
    this.y = randomMultiple(scl * 2, h - scl * 2, scl);
  }
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(
      randomMultiple(scl * 2, w - scl * 2, scl),
      randomMultiple(scl * 2, h - scl * 2, scl)
    );
    this.xv = 0;
    this.yv = 0;
  }
  setDir(x, y) {
    this.xv = x * scl;
    this.yv = y * scl;
  }
  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xv;
    head.y += this.yv;
    this.body.push(head);
  }
  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
  }
  show() {
    this.isoffbounds();
    for (let i = 0; i < this.body.length; i++) {
      fill(25, 25, 25);
      stroke(255)
      rect(this.body[i].x, this.body[i].y, scl, scl);
    }
  }
  eat(fx, fy) {
    let head = this.body[this.body.length - 1].copy();
    if (head.x == fx && head.y == fy) {
      return true;
    }
  }
  reset() {
    this.body = [];
    this.body[0] = createVector(
      randomMultiple(scl * 2, w - scl * 2, scl),
      randomMultiple(scl * 2, h - scl * 2, scl)
    );
  }
  isdead() {
    let head = this.body[this.body.length - 1];
    for (let i = 0; i < this.body.length - 1; i++) {
      let bp = this.body[i];
      if (head.x == bp.x && head.y == bp.y) {
        return true;
      }
    }
  }
  isoffbounds() {
    let head = this.body[this.body.length - 1];
    if (head.x > w) {
      head.x = 0;
    } else if (head.x < 0) {
      head.x = w;
    } else if (head.y > h) {
      head.y = 0;
    } else if (head.y < 0) {
      head.y = h;
    }
  }
}

function setup() {
  const score = document.getElementById("score")
  canvas = createCanvas(w, h);
  canvas.parent("sketch")
  snake = new Snake();
  food = new Food();
}
function keyPressed() {
  scorelock = 0;
  if ((keyCode === LEFT_ARROW || keyCode == 65) && last !== "RIGHT") {
    snake.setDir(-1, 0);
    last = "LEFT";
  } else if ((keyCode === RIGHT_ARROW || keyCode == 68) && last !== "LEFT") {
    snake.setDir(1, 0);
    last = "RIGHT";
  } else if ((keyCode === DOWN_ARROW || keyCode == 83) && last !== "UP") {
    snake.setDir(0, 1);
    last = "DOWN";
  } else if ((keyCode === UP_ARROW || keyCode == 87) && last !== "DOWN") {
    snake.setDir(0, -1);
    last = "UP";
  } else if (key == " " && !isalive) {
    snake.reset();
    isalive = 1;
    scorevalue = 0;
  }
}

function draw() {
  if (isalive) {
    background(77, 92, 80);
    frameRate(10);
    food.render();

    if (snake.eat(food.x, food.y)) {
      snake.grow();
      food.spawn();
      scorevalue += 10 * snake.body.length;
    }
    snake.show();
    snake.update();

    if (snake.isdead()) {
      fill(25, 25, 25);
      textSize(32);
      textStyle(BOLD)
      stroke(0)
      textAlign(CENTER, CENTER);
      text("Dead! press Spacebar", w / 2, h / 2);
      isalive = 0;
    }

    if(!scorelock){
      score.innerHTML = `Score: ${scorevalue}`
    }
   
  }
}
