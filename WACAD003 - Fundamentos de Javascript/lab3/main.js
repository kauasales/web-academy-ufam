// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.type = "ball";
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }
  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function (others) {
  for (let j = 0; j < others.length; j++) {
    if (this !== others[j]) {
      const dx = this.x - others[j].x;
      const dy = this.y - others[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = this.size + others[j].size;

      if (distance < minDistance) {
        this.color = randomRGB();
        others[j].color = randomRGB();
      }
    }
  }
};

function Diamond(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size; 
  this.type = "diamond";
}

Diamond.prototype.draw = function () {
  ctx.beginPath();
  const top = { x: this.x, y: this.y - this.size };
  const right = { x: this.x + this.size, y: this.y };
  const bottom = { x: this.x, y: this.y + this.size };
  const left = { x: this.x - this.size, y: this.y };

  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();
  ctx.fillStyle = this.color;
  ctx.fill();
};

Diamond.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }
  this.x += this.velX;
  this.y += this.velY;
};

Diamond.prototype.collisionDetect = function (others) {
  for (let j = 0; j < others.length; j++) {
    if (this !== others[j]) {
      const dx = this.x - others[j].x;
      const dy = this.y - others[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = this.size + others[j].size;

      if (distance < minDistance) {
        this.color = randomRGB();
        others[j].color = randomRGB();
      }
    }
  }
};

const objects = []; // array misto de bolas e losangos

while (objects.filter(obj => obj.type === "ball").length < 15) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  objects.push(ball);
}

while (objects.filter(obj => obj.type === "diamond").length < 10) {
  const size = random(10, 20);
  const diamond = new Diamond(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  objects.push(diamond);
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < objects.length; i++) {
    objects[i].draw();
    objects[i].update();
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].collisionDetect(objects);
  }

  requestAnimationFrame(loop);
}

// Inicia a animação
loop();