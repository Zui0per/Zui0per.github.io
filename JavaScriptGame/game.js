const playerSize = 20;
const numberOfRedCircles = 20;
const maxRadius = 50;
const playerSpeed = 120;

let canvas;
let ctx;

let redCircles;

let secondsPassed = 0;
let lastTimeInterval = 0;

let isGameOver = false;
let score = 0;
let lastScore = 0;
let counterX = 0;
let counterY = 0;

let redCirSpeedX;
let redCirSpeedY;
let distance;

let speed = {
    x: 0, 
    y: 0
};

let playerPos = {
    x:0,
    y:0
};

let playerDif = {
    dx: 0,
    dy: 0 
};

function keysPressed(e) 
{
    switch (e.key) 
    {
        case 'ArrowUp':
            speed.x = 0;
            speed.y = -playerSpeed;
            break;

        case 'ArrowDown':
            speed.x = 0;
            speed.y = playerSpeed;   
            break;

        case 'ArrowLeft':
            speed.x = -playerSpeed;
            speed.y = 0;
            break;

        case 'ArrowRight':
            speed.x = playerSpeed;
            speed.y = 0;
            break;
    }
    e.preventDefault();
}

function init() 
{
    canvas = document.getElementById("gameBack");
    ctx = canvas.getContext("2d");

    makeCircles(numberOfRedCircles);
    window.requestAnimationFrame(gameLoop);
}

function makeCircles(n) 
{
    redCircles = new Array(n);
    redCirSpeedX = new Array(n);
    redCirSpeedY = new Array(n);
    distance = new Array(n);
    distance.fill(0);

    for (i = 0; i < n; i++) 
    {
        redCircles[i] = new Circle(getRandomArbitrary(maxRadius + 5, canvas.width - maxRadius - 5), getRandomArbitrary(maxRadius + 5, canvas.height - maxRadius -5), getRandomArbitrary(10, maxRadius));
        redCirSpeedX[i] = getRandomArbitrary(-50, 50); 
        redCirSpeedY[i] = getRandomArbitrary(-50, 50); 
    }
}

function gameLoop(timeInterval)
{
    secondsPassed = (timeInterval - lastTimeInterval) / 1000;
    lastTimeInterval = timeInterval;
    update(secondsPassed);
    checkCollision();
    draw();

    if(isGameOver == true) 
    {
        lastScore = score.toFixed(2);
        console.log(lastScore);
        document.getElementById("lastScore").textContent = lastScore;
        gameOver();
    }

    if (gameOver != true) {
        window.requestAnimationFrame(gameLoop);
    }  
}

function update(secondsPassed)
{
    updateCircles(secondsPassed);
    updatePlayer(secondsPassed);
    updateScore(secondsPassed);
}

function updateCircles(secondsPassed) 
{
    for(i = 0; i < redCircles.length; i++) 
    {
        if(redCircles[i].y >= canvas.height - redCircles[i].radius || redCircles[i].y <= redCircles[i].radius)
        {
            redCirSpeedY[i] = - redCirSpeedY[i];
        }
    
        if(redCircles[i].x >= canvas.width - redCircles[i].radius  || redCircles[i].x <= redCircles[i].radius) 
        {
            redCirSpeedX[i] = - redCirSpeedX[i];
        }  
        
        redCircles[i].x += (redCirSpeedX[i] * secondsPassed); 
        redCircles[i].y += (redCirSpeedY[i] * secondsPassed); 
    }
}

function updatePlayer(secondsPassed) 
{
    if(playerPos.y >= canvas.height - playerSize || playerPos.y <= playerSize)
    {
        playerDif.dy = -playerDif.dy;
        counterY++;
    } 
    else 
    {
        counterY = 0;
    }

    if(playerPos.x >= canvas.width - playerSize  || playerPos.x <= playerSize)
    {
        playerDif.dx = -playerDif.dx;
        counterX++;
    } 
    else 
    {
        counterX = 0;
    }

    if (counterX == 10 || counterY == 10) 
    {
        playerDif.dx = 0;
        playerDif.dy = 0;
    }

    playerDif.dx += (speed.x * secondsPassed);
    playerDif.dy += (speed.y * secondsPassed);
}

function updateScore(secondsPassed) 
{
    score += secondsPassed;
}

function checkCollision() 
{
    // Check Player Collision
    for (i = 0; i < redCircles.length; i++) 
    {   
        if (Math.sqrt( (Math.pow((redCircles[i].x - playerPos.x), 2)) + (Math.pow((redCircles[i].y - playerPos.y), 2)))  <= (redCircles[i].radius + playerSize)) 
        {   
            isGameOver = true;
            break;
        }
    }  

    for (i = 0; i < redCircles.length; i++) 
    {  
        for (j = 0; j < redCircles.length; j++) 
        {
            if (i == j) {
                continue;
            }  
             
            distance[j] = Math.sqrt( (Math.pow((redCircles[i].x-redCircles[j].x), 2)) + (Math.pow((redCircles[i].y-redCircles[j].y), 2)));

            if(distance[j] <= (redCircles[i].radius + redCircles[j].radius)) 
            {
                let vCollision = {x: redCircles[j].x- redCircles[i].x, y: redCircles[j].y - redCircles[i].y};
                let vCollisionNorm = {x: vCollision.x / distance[j], y: vCollision.y / distance[j]};
                let vRelativeVelocity = {x: redCirSpeedX[i] - redCirSpeedX[j], y: redCirSpeedY[i] - redCirSpeedY[j]}; 
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y; 
                
                if (speed < 0)
                {
                    break;
                }    

                redCirSpeedX[i] -= (speed * vCollisionNorm.x);
                redCirSpeedY[i] -= (speed * vCollisionNorm.y);
                redCirSpeedX[j] += (speed * vCollisionNorm.x);
                redCirSpeedY[j] += (speed * vCollisionNorm.y);
            }
        }
    }
}

function draw() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    drawPlayer();
    drawScore();
}

function drawCircles() 
{
    for(i = 0; i < redCircles.length; i++) 
    {  
        ctx.beginPath();
        ctx.arc(redCircles[i].x, redCircles[i].y, redCircles[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
}

function drawPlayer() 
{
    ctx.beginPath();
    playerPos.x = canvas.width/2 + playerDif.dx;
    playerPos.y = canvas.height/2 + playerDif.dy;
    ctx.arc(playerPos.x, playerPos.y, playerSize, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawScore() 
{
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score.toFixed(2), canvas.width/2, 50);    
}


function gameOver()
{
    isGameOver = false;
    score = 0;
    playerDif.dx = 0;
    playerDif.dy = 0; 
    redCircles.length = 0;
    speed.x = 0;
    speed.y = 0;
    redCirSpeedX.length = 0;
    redCirSpeedY.length = 0;
    distance.length = 0;
    makeCircles(numberOfRedCircles);
}

function getRandomArbitrary(min, max) 
{
    return Math.random() * (max - min) + min;
}

class Circle {
    constructor(x, y, radius) 
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

window.addEventListener("keydown", keysPressed, false);
document.addEventListener("DOMContentLoaded", init);


