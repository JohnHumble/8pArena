// WEAPONS
var forceImage = new Image();
forceImage.src = "sprites/forceRU.png";

var swordSteelR = new Image();
swordSteelR.src = "sprites/swordsteel.png";
var swordSteelL = new Image();
swordSteelL.src = "sprites/swordsteelL.png";
var swordSteelRD = new Image();
swordSteelRD.src = "sprites/swordsteelRD.png";
var swordSteelLD = new Image();
swordSteelLD.src = "sprites/swordsteelLD.png";
// TODO add weapons

function drawWeapon(weapon,x, y, tarX, tarY, active){
    let offsetX = 0;
    let offsetY = 0;
    let image = weapon.rd;

    let left = false;
    let up = false;
    
    let rot = Math.atan2(tarY - y, tarX - x);

    
    //TODO make this not just the player
    playerAttack.x = tileSize * Math.cos(rot) + x - tileSize/2;
    playerAttack.y = tileSize * Math.sin(rot) + y - tileSize/2;
    
    let rotOff = -Math.PI/4;

    if (active){
        rotOff = Math.PI/4;
    }

    let dis = tileSize/4;
    let disx = dis * Math.cos(rot + rotOff);
    let disy = dis * Math.sin(rot + rotOff);


    if (disx + x < x){
        offsetX = -tileSize;
        left = true;
    }

    if (disy + y < y){
        offsetY = - 5 * tileSize / 8;
        up = true;
    }

    //TODO make the weapon different if attacking

    if (up && left) {
        image = weapon.lu;
    }
    else if (up) {
        image = weapon.ru;
    }
    else if (left) {
        image = weapon.ld;
    }



    ctx.drawImage(image,x + disx + offsetX,y + disy + offsetY,tileSize,tileSize);

    if (active){
        ctx.drawImage(forceImage,playerAttack.x, playerAttack.y,tileSize,tileSize);
    }
}

// PLAYER
var pRight = new Image();
pRight.src = "sprites/p1right.png";
var pLeft = new Image();
pLeft.src = "sprites/p1left.png";

var playerSpeed = 8;
var toHit = 10;

var player = {};
var targetX = 0;
var targetY = 0;
var playerAttack = {
    x: 0,
    y: 0,
    active: false,
    tic:0
};

function setPlayer() {
    player = {
        x:tileSize/2,
        y:tileSize/2,
        d:"right",

        weapon1: {
            name: "Steel Sword",
            ru: swordSteelR,
            lu: swordSteelL,
            rd: swordSteelRD,
            ld: swordSteelLD
        }
    }
}

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

function movePlayer(e) {
    if (e.key == "D" || e.key == "d") {
        rightPressed = true;
    }
    else if (e.key == "A" || e.key == "a"){
        leftPressed = true;
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

var screenX = 0;
var screenY = 0;
function playerAim(e){
    screenX = e.x;
    screenY = e.y;

    if (e.clientX - canvas.offsetLeft < canvas.width/2){
        player.d = "left";
    }
    else {
        player.d = "right";
    }
}

function playerAtck(e) {
    playerAttack.active = true;
}

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

    if (playerAttack.active) {
        playerAttack.tic++;
        if (playerAttack.tic > toHit) {
            playerAttack.tic = 0;
            playerAttack.active = false;
        }
    }

    targetX = screenX - transX;
    targetY = screenY - transY;
}

function drawPlayer(){
    var pImage = pRight;
    if (player.d == "left"){
        pImage = pLeft;
    }
    ctx.drawImage(pImage,player.x - tileSize/2,player.y-tileSize/2,tileSize,tileSize);
    drawWeapon(player.weapon1,player.x,player.y,targetX, targetY,playerAttack.active);
}

// TODO add enimies
