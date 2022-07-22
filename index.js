const canvas = document.querySelector('canvas');
canvas.width = 0;
canvas.height = 0;
canvas.style.display = 'none';

function playerVSComp() {
  // canvas setup
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.display = 'block';
  canvas.width = 1000;
  canvas.height = 800;
  const score1 = document.getElementById("player1-score");
  const score2 = document.getElementById("player2-score");
  const gameOver = document.getElementById('gameOver');
  gameOver.style.display = 'none';

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "w" ||
            e.key === "s" ||
            e.key === "d" ||
            e.key === "a" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowRight" ||
            e.key === "ArrowLeft") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Ball {
    constructor(game) {
      this.game = game;
      this.radius = 15;
      this.width = 30;
      this.height = 30;
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.speed = 5;
      this.velocityX = 5;
      this.velocityY = 5;
      this.speedIncrement = 0;
    }
    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      // ball and wall boundaries
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.velocityY = -this.velocityY;
      }
    }
    draw(context) {
      context.fillStyle = "lime";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 20;
      this.height = 85;
      this.x = 40;
      this.y = 370; // 750
      this.speedY = 0;
    }
    update() {
      // key controls
      if (this.game.keys.includes("w")) this.speedY = -15;
      else if (this.game.keys.includes("s")) this.speedY = 15;
      else this.speedY = 0;
      this.y += this.speedY;
      // boundaries
      if (this.height + this.y >= 800) {
        this.y = 720;
      } else if (this.y - this.height <= -97) { // -100
        this.y = 0;
      } else {}
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player2 {
    constructor(game) {
      this.game = game;
      this.width = 20;
      this.height = 85;
      this.x = 940;
      this.y = 370; // 750
      this.speedY = 0;
      this.computerDelay = 0.1;
    }
    update() {
      // boundaries
      if (this.height + this.y >= 800) {
        this.y = 720;
      } else if (this.y - this.height <= -100) {
        this.y = 0;
      } else {}
    }
    draw(context) {
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Net {
    constructor(game) {
      this.game = game;
      this.x = canvas.width / 2 - 2 / 2;
      this.y = 0;
      this.width = 2;
      this.height = 10;
      this.color = "white";
    }
    update() {}
    draw(context) {
      for (let i = 0; i <= canvas.height; i += 15) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y + i, this.width, this.height);
      }
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 50;
      this.fontFamily = 'ArcadeClassic';
      this.color = 'white';
    }
    draw(context) {
      context.font = this.fontSize + 'px ' + this.fontFamily;
      // score
      context.fillStyle = this.color;
      context.fillText('Score: ' + this.game.score, 20, 40);

      context.font = this.fontSize + 'px ' + this.fontFamily;
      context.fillStyle = 'cyan';
      context.fillText('Score: ' + this.game.score2, 600, 40);
    }
  }
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.keys = [];
      this.player = new Player(this);
      this.player2 = new Player2(this);
      this.ball = new Ball(this);
      this.net = new Net(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.score = 0;
      this.score2 = 0;
      this.winningScore = 5;
    }
    update() {
      this.player.update();
      this.player2.update();
      this.net.update();
      this.ball.update();

      if (this.checkCollision(this.ball, this.player)) {
        this.ball.velocityX += 2;
        this.ball.velocityY += 2;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;
      }

      if (this.checkCollision(this.ball, this.player2)) {
        this.ball.velocityX += 3;
        this.ball.velocityY += 3;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;
      }

      // score
      if (this.ball.x >= 999) {
        this.score += 1;
        this.ball.velocityX = 4;
        this.ball.velocityY = 4;
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
      }

      if (this.ball.x <= 0) {
        this.score2 += 1;
        this.ball.velocityX = 4;
        this.ball.velocityY = 4;
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
      }

      
      if (this.score === this.winningScore) {
        gameOver.style.display = 'block';
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        document.getElementById('restart-h1').innerHTML = `Player1   Won!`;
      }

      if (this.score2 === this.winningScore) {
        gameOver.style.display = 'block';
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        document.getElementById('restart-h1').innerHTML = `Computer   Won!`;
      }

      if (this.ball.y === this.player.y + 42.5 && checkCollision() === true) {
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;
      }

      if (this.ball.y === this.player.y - 42.5 && checkCollision() === true) {
        this.ball.velocityX = this.ball.velocityX;
        this.ball.velocityY = this.ball.velocityY;
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          gameOver.style.display = 'block';
          this.ball.velocityX = 0;
          this.ball.velocityY = 0;
        }
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          gameOver.style.display = 'none';
          this.ball.velocityX = 4;
          this.ball.velocityY = 4;
        }
      });
      
      // control computer paddle
      this.player2.y += (this.ball.y - (this.player2.y + this.player2.height / 2));
    }
    draw(ctx) {
      this.player.draw(ctx);
      this.player2.draw(ctx);
      this.net.draw(ctx);
      this.ball.draw(ctx);
      this.ui.draw(ctx);
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + 10 + rect2.width + 10 &&
        rect1.x + rect1.width > rect2.x + 10 &&
        rect1.y < rect2.y + 10 + rect2.height + 10 &&
        rect1.height + rect1.y > rect2.y + 10
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);

  // animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate();
};



// Player VS. Player
function playerVSPlayer() {

  // canvas setup
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.display = 'block';
  canvas.width = 1000;
  canvas.height = 800;
  const score1 = document.getElementById("player1-score");
  const score2 = document.getElementById("player2-score");
  const gameOver = document.getElementById('gameOver');
  gameOver.style.display = 'none';

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "w" ||
            e.key === "s" ||
            e.key === "d" ||
            e.key === "a" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowRight" ||
            e.key === "ArrowLeft") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Ball {
    constructor(game) {
      this.game = game;
      this.radius = 15;
      this.width = 30;
      this.height = 30;
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.speed = 5;
      this.velocityX = 5;
      this.velocityY = 5;
      this.speedIncrement = 0;
    }
    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      // ball and wall boundaries
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.velocityY = -this.velocityY;
      }
    }

    draw(context) {
      context.fillStyle = "lime";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 20;
      this.height = 85;
      this.x = 40;
      this.y = 370; // 750
      this.speedY = 0;
    }
    update() {
      // key controls
      if (this.game.keys.includes("w")) this.speedY = -15;
      else if (this.game.keys.includes("s")) this.speedY = 15;
      else this.speedY = 0;
      this.y += this.speedY;
      // boundaries
      if (this.height + this.y >= 800) {
        this.y = 720;
      } else if (this.y - this.height <= -100) {
        this.y = 0;
      } else {}
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player2 {
    constructor(game) {
      this.game = game;
      this.width = 20;
      this.height = 85;
      this.x = 940;
      this.y = 370; // 750
      this.speedY = 0;
    }
    update() {
      // key controls
      if (this.game.keys.includes("ArrowUp")) this.speedY = -15;
      else if (this.game.keys.includes("ArrowDown")) this.speedY = 15;
      else this.speedY = 0;
      this.y += this.speedY;
      // boundaries
      if (this.height + this.y >= 800) {
        this.y = 720;
      } else if (this.y - this.height <= -100) {
        this.y = 0;
      } else {}
    }
    draw(context) {
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Net {
    constructor(game) {
      this.game = game;
      this.x = canvas.width / 2 - 2 / 2;
      this.y = 0;
      this.width = 2;
      this.height = 10;
      this.color = "white";
    }
    update() {}
    draw(context) {
      for (let i = 0; i <= canvas.height; i += 15) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y + i, this.width, this.height);
      }
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 50;
      this.fontFamily = 'ArcadeClassic';
      this.color = 'white';
    }
    draw(context) {
      context.font = this.fontSize + 'px ' + this.fontFamily;
      // score
      context.fillStyle = this.color;
      context.fillText('Score: ' + this.game.score, 20, 40);

      context.font = this.fontSize + 'px ' + this.fontFamily;
      context.fillStyle = 'cyan';
      context.fillText('Score: ' + this.game.score2, 600, 40);
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.keys = [];
      this.player = new Player(this);
      this.player2 = new Player2(this);
      this.ball = new Ball(this);
      this.net = new Net(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.score = 0;
      this.score2 = 0;
      this.winningScore = 5;
    }
    update() {
      this.player.update();
      this.player2.update();
      this.net.update();
      this.ball.update();

      if (this.checkCollision(this.ball, this.player)) {
        this.ball.velocityX += 2;
        this.ball.velocityY += 2;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;
      }

      if (this.checkCollision(this.ball, this.player2)) {
        this.ball.velocityX += 2;
        this.ball.velocityY += 2;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;
      }
      // score
      if (this.ball.x >= 999) {
        this.score += 1;
        this.ball.velocityX = 4;
        this.ball.velocityY = 4;
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
      }

      if (this.ball.x <= 0) {
        this.score2 += 1;
        this.ball.velocityX = 4;
        this.ball.velocityY = 4;
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
      }


      if (this.score === this.winningScore) {
        gameOver.style.display = 'block';
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        document.getElementById('restart-h1').innerHTML = `Player1   Won!`;
      }

      if (this.score2 === this.winningScore) {
        gameOver.style.display = 'block';
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        this.player.speedY = false;
        this.player2.speedY = false;
        document.getElementById('restart-h1').innerHTML = `Player2 Won!`;
      }
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          gameOver.style.display = 'block';
          this.ball.velocityX = 0;
          this.ball.velocityY = 0;
        }
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          gameOver.style.display = 'none';
          this.ball.velocityX = 4;
          this.ball.velocityY = 4;
        }
      });
      window.addEventListener('keyup', function(e){console.log(e.keyCode)});

    }

    draw(ctx) {
      this.player.draw(ctx);
      this.player2.draw(ctx);
      this.net.draw(ctx);
      this.ball.draw(ctx);
      this.ui.draw(ctx);
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + 4 + rect2.width + 4 &&
        rect1.x + rect1.width > rect2.x + 4 &&
        rect1.y < rect2.y + 4 + rect2.height + 4 &&
        rect1.height + rect1.y > rect2.y + 4
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);

  // animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate();
};
