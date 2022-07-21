window.addEventListener('load', function(){

// canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 800;
const score1 = document.getElementById('player1-score');
const score2 = document.getElementById('player2-score');

class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', e => {
            if (( (e.key === 'w') ||
                  (e.key === 's') ||
                  (e.key === 'd') ||
                  (e.key === 'a') ||
                  (e.key === 'ArrowUp') ||
                  (e.key === 'ArrowDown') ||
                  (e.key === 'ArrowRight') ||
                  (e.key === 'ArrowLeft') 
            ) && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
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

        // point system
        if (this.x >= canvas.width) {
            let scoreIncrement1 = 0;
            scoreIncrement1 += 1;
            score1.innerHTML = `Player  -  One: ${scoreIncrement1}`;
            this.velocityX = -this.velocityX;
            this.velocityY = -this.velocityY;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;

        } else if (this.x <= 0) {
            let scoreIncrement2 = 0;
            scoreIncrement2 += 1;
            score2.innerHTML = `Player  -  Two: ${scoreIncrement2}`;
            this.velocityX = -this.velocityX;
            this.velocityY = -this.velocityY;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
        } else { this.speedIncrement = 0};
    }

    draw(context) {
    context.fillStyle = 'lime';
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
        if (this.game.keys.includes('w')) this.speedY = -15;
        else if (this.game.keys.includes('s')) this.speedY = 15;
        else this.speedY = 0;
        this.y += this.speedY;
        // boundaries
        if (this.height + this.y >= 800) {
            this.y = 720;
        } else if (this.y - this.height <= -100) {
            this.y = 0;
        } else {
            
        }
    }
    draw(context) {
        context.fillStyle = 'red';
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
        if (this.game.keys.includes('ArrowUp')) this.speedY = -15;
        else if (this.game.keys.includes('ArrowDown')) this.speedY = 15;
        else this.speedY = 0;
        this.y += this.speedY;
        // boundaries
        if (this.height + this.y >= 800) {
            this.y = 720;
        } else if (this.y - this.height <= -100) {
            this.y = 0;
        } else {

        }
    }
    draw(context) {
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Net {
    constructor(game) {
        this.game = game;
        this.x =  canvas.width/2 - 2/2;
        this.y = 0;
        this.width = 2;
        this.height = 10;
        this.color = 'white';
    }
    update() {

    }
    draw(context) {
        for (let i = 0; i <= canvas.height; i += 15) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y + i, this.width, this.height);
        }
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
    }
    update() {
        this.player.update();
        this.player2.update();
        this.net.update();
        this.ball.update();
        
        if (this.checkCollision(this.ball, this.player)) {
            this.ball.velocityX = -this.ball.velocityX;
            this.ball.velocityY = -this.ball.velocityY;
        }

        if (this.checkCollision(this.ball, this.player2)) {
            this.ball.velocityX = -this.ball.velocityX;
            this.ball.velocityY = -this.ball.velocityY;
        }
    }
    draw(ctx) {
        this.player.draw(ctx);
        this.player2.draw(ctx);
        this.net.draw(ctx);
        this.ball.draw(ctx);
    }
    checkCollision(rect1, rect2){
        return (        rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.height + rect1.y > rect2.y)
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
});