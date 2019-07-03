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

function drawWeapon(weapon,x, y, tarX, tarY){
    let offsetX = 0;
    let offsetY = 0;
    let image = weapon.rd;

    let left = false;
    let up = false;
    
    let rot = Math.atan2(tarY - y, tarX - x);

    weapon.x = tileSize * Math.cos(rot) + x - tileSize/2;
    weapon.y = tileSize * Math.sin(rot) + y - tileSize/2;
    
    let rotOff = -Math.PI/4;

    if (weapon.active){
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

    if (weapon.active){
        ctx.drawImage(forceImage,weapon.x, weapon.y,tileSize,tileSize);
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

function setPlayer() {
    player = {
        x:tileSize/2,
        y:tileSize/2,
        d:"right",

        weapon1: {
            name: "Steel Sword",
            x: 0,
            y: 0,
            active: false,
            tic:0,
            damage:5,
            // textures
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
    player.weapon1.active = true;
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

    updateWeapon(player.weapon1);

    targetX = screenX - transX;
    targetY = screenY - transY;
}

function updateWeapon(weapon) {
    if (weapon.active) {
        weapon.tic++;
        if (weapon.tic > toHit) {
            weapon.tic = 0;
            weapon.active = false;    
        }
    }
}

function drawPlayer(){
    var pImage = pRight;
    if (player.d == "left"){
        pImage = pLeft;
    }
    ctx.drawImage(pImage,player.x - tileSize/2,player.y-tileSize/2,tileSize,tileSize);
    drawWeapon(player.weapon1,player.x,player.y,targetX, targetY);
}

// TODO add enimies
var skeletonR = new Image();
skeletonR.src = "sprites/skeleton.png";

var enimies = [];

function placeEnimies(count) {

    for (let i = 0; i < count; i++) {
        let s = randInt(ground.length);
        enimies[i] = {
            x:ground[s].x + tileSize/2,
            y:ground[s].y + tileSize/2,
            hp: 10,

            tarX:player.x,
            tarY:player.y,

            // textures
            sprite:skeletonR,

            weapon: {
                name: "Steel Sword",
                x: 0,
                y: 0,
                active: false,
                tic:0,
                damage: 5,
                // textures
                ru: swordSteelR,
                lu: swordSteelL,
                rd: swordSteelRD,
                ld: swordSteelLD
            }
        }
    }
}

function updateEnimies() {
    for (let i = 0; i < enimies.length; i++) {
        let en = enimies[i];
        en.tarX = player.x;
        en.tarY = player.y;

        // test if dead
        if (testHit(player.weapon1,en)) {
            enimies.splice(i,1);
            i--;
        }

        updateWeapon(en.weapon);
    }
}

function drawEnimies() {
    for (let i = 0; i < enimies.length; i++) {
        let en = enimies[i];
        
        ctx.drawImage(en.sprite,en.x - tileSize/2,en.y-tileSize/2,tileSize,tileSize);
        drawWeapon(en.weapon,en.x,en.y,en.tarX,en.tarY);
    }
}

function testHit(weapon, entitiy){
    if (weapon.active) {
        // see if the weapon is within tilesize/2
        let dis = getDistance(weapon.x, weapon.y,entitiy.x,entitiy.y);
        return dis <= tileSize;
    }
}

function getDistance(x1,y1, x2,y2) {
    let disX = x2 - x1;
    let disY = y2 - y1;
    return Math.sqrt(disX * disX + disY * disY);
}
