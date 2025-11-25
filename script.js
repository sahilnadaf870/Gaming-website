const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: 'red',
    dy: 0,
    speed: 12,
    jumpPower: 18,
    grounded: true
};


let gravity = 0.8;
let obstacles = [];
let obstacleSpeed = 5;
let obstacleSpawnRate = 0.02;
let score = 0;
let gameOver = false;

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    " ": false
};

document.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});


document.getElementById('left').addEventListener('touchstart', () => keys.ArrowLeft = true);
document.getElementById('left').addEventListener('touchend', () => keys.ArrowLeft = false);

document.getElementById('right').addEventListener('touchstart', () => keys.ArrowRight = true);
document.getElementById('right').addEventListener('touchend', () => keys.ArrowRight = false);

document.getElementById('jump').addEventListener('touchstart', () => {
    if (player.grounded) {
        player.dy = -player.jumpPower;
        player.grounded = false;
    }
});

function spawnObstacle() {
    let width = 50 + Math.random() * 60;
    let height = 50;
    let x = Math.random() * (canvas.width - width);
    let colors = ['#ff3f3f', '#3fff3f', '#3f3fff', '#ff3fff', '#ffff3f'];
    let color = colors[Math.floor(Math.random() * colors.length)];

    obstacles.push({ x, y: -height, width, height, color });
}


function updateLevel() {
    let levelText = "Easy";

    if (score > 50 && score <= 150) {
        obstacleSpeed = 7;
        obstacleSpawnRate = 0.04;
        levelText = "Medium";
    } 
    else if (score > 500 && score <= 750) {
        obstacleSpeed = 9;
        obstacleSpawnRate = 0.06;
        levelText = "Hard";
    }
    else if (score > 900) {
        obstacleSpeed = 12;
        obstacleSpawnRate = 0.08;
        levelText = "Fast";
    }

    document.getElementById('level').innerText = "Level: " + levelText;
}


function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;

    if ((keys.ArrowUp || keys[" "]) && player.grounded) {
        player.dy = -player.jumpPower;
        player.grounded = false;
    }

    
    player.dy += gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height - 100) {
        player.y = canvas.height - 100 - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    
    let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    player.color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

   
    if (Math.random() < obstacleSpawnRate) spawnObstacle();

    for (let i = 0; i < obstacles.length; i++) {
        let ob = obstacles[i];
        ob.y += obstacleSpeed;

        ctx.fillStyle = ob.color;
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        if (
            player.x < ob.x + ob.width &&
            player.x + player.width > ob.x &&
            player.y < ob.y + ob.height &&
            player.y + player.height > ob.y
        ) {
            gameOver = true;
            alert("Game Over! Score: " + score);
            location.reload();
        }
    }

    score++;
    document.getElementById('score').innerText = "Score: " + score;

    updateLevel();
    requestAnimationFrame(update);
}

update();

