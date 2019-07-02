// WEAPONS
var swordImage = new Image();

// TODO add weapons

// PLAYER
var pRight = new Image();
pRight.src = "sprites/p1right.png";
var pLeft = new Image();
pLeft.src = "sprites/p1left.png";

var playerSpeed = 8;

var player = {};

function setPlayer(){
    player = {
        x:tileSize/2,
        y:tileSize/2,
        d:"right"
    }
}

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

function movePlayer(e) {
    if (e.key == "D" || e.key == "d") {
        rightPressed = true;
        player.d = "right";
    }
    else if (e.key == "A" || e.key == "a"){
        leftPressed = true;
        player.d = "left";
    }
    else if (e.key == "W" || e.key == "w"){
        upPressed = true;
    }
    else if (e.key == "S" || e.key == "s"){
        downPressed = true;
    }
}

function stopPlayer(e) {
    if (e.key == "D" || e.key == "d") {
        rightPressed = false;
    }
    else if (e.key == "A" || e.key == "a"){
        leftPressed = false;
    }
    else if (e.key == "W" || e.key == "w"){
        upPressed = false;
    }
    else if (e.key == "S" || e.key == "s"){
        downPressed = false;
    }
}

// TODO add an attack system

function playerUpdate(){
    if (rightPressed && onGround(player.x + playerSpeed,player.y)){
        player.x += playerSpeed;
    }
    else if (leftPressed && onGround(player.x - playerSpeed,player.y)) {
        player.x -= playerSpeed;
    }
    if (downPressed && onGround(player.x,player.y + playerSpeed)) {
        player.y += playerSpeed;
    }
    else if (upPressed && onGround(player.x,player.y - playerSpeed)) {
        player.y -= playerSpeed;
    }
}

function drawPlayer(){
    var pImage = pRight;
    if (player.d == "left"){
        pImage = pLeft;
    }
    ctx.drawImage(pImage,player.x - tileSize/2,player.y-tileSize/2,tileSize,tileSize);
}

// TODO add enimies
