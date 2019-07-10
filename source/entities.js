// SHEILDS
var sheildImage = new Image();
sheildImage.src = "sprites/sheild.png";

function drawSheild(sheild, x, y, tarX, tarY) {
    let offsetX = 0; 
    let offsetY = 0;
    let image = sheild.image;

    let rot = Math.atan2(tarY - y, tarX - x);

    if (sheild.active){
        sheild.x = tileSize/2 * Math.cos(rot) + x;
        sheild.y = tileSize/2 * Math.sin(rot) + y;
    }
    else {
        sheild.x = -tileSize/3 * Math.cos(rot) + x;
        sheild.y = -tileSize/3 * Math.sin(rot) + y;
    }

    ctx.drawImage(image,sheild.x - tileSize/2,sheild.y - tileSize/2,tileSize,tileSize);
}

function createSteelSheild(){
    return {
        name: "Steel Sheild",
        x: 0,
        y: 0,
        active: false,
        image: sheildImage
    }
}

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

function drawWeapon(weapon,x, y, tarX, tarY){
    let offsetX = 0;
    let offsetY = 0;
    let image = weapon.rd;

    let left = false;
    let up = false;
    
    let rot = Math.atan2(tarY - y, tarX - x);

    weapon.x = tileSize * Math.cos(rot) + x;
    weapon.y = tileSize * Math.sin(rot) + y;
    
    let rotOff = -0;

    if (weapon.active){
        rotOff = Math.PI/2;
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
        ctx.drawImage(forceImage,weapon.x - tileSize/2, weapon.y - tileSize/2,tileSize,tileSize);
    }
}

// create weapons
function createSteelSword(){
    return {
        name: "Steel Sword",
        x: 0,
        y: 0,
        active: false,
        tic:0,
        cool:toHit*2,
        damage:5,
        // textures
        ru: swordSteelR,
        lu: swordSteelL,
        rd: swordSteelRD,
        ld: swordSteelLD,

        // functions
        use: function() {
            if (this.tic <= 0) {
                this.tic = this.cool;
                this.active = true;
            }
        }
    }
}

// PLAYER
var pRight = new Image();
pRight.src = "sprites/p1right.png";
var pLeft = new Image();
pLeft.src = "sprites/p1left.png";

var crosshairImage = new Image();
crosshairImage.src = "sprites/crosshiar.png"

var playerSpeed = 8;
var toHit = 2;

var player = {};
var targetX = 0;
var targetY = 0;
var playerTile = {};

function setPlayer() {
    player = {
        x:tileSize/2,
        y:tileSize/2,
        d:"right",

        hp:50,
        hpMax:50,

        weapon1: createSteelSword(),
        sheild: createSteelSheild()
    }
    rightPressed = false;
    leftPressed = false;
    downPressed = false;
    upPressed = false;
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

function playerAtck() {
    player.weapon1.use();
}

function activateSheild() {
    player.sheild.active = true;
}

function sheildDown() {
    player.sheild.active = false;
}

var lastTile = playerTile;
function playerUpdate(){
    playerTile = getTile(player.x,player.y);

    // if the tile has changed then update the path
    if (playerTile != lastTile && playerTile != undefined) {
        resetPath();
        findPath(playerTile);
        lastTile = playerTile;
   //     console.log(playerTile);
    }
    let speed = playerSpeed;

    if (player.sheild.active){
        speed /= 2;
    }

    if (rightPressed && onGround(player.x + playerSpeed,player.y)){
        player.x += speed;
    }
    else if (leftPressed && onGround(player.x - playerSpeed,player.y)) {
        player.x -= speed;
    }
    if (downPressed && onGround(player.x,player.y + playerSpeed)) {
        player.y += speed;
    }
    else if (upPressed && onGround(player.x,player.y - playerSpeed)) {
        player.y -= speed;
    }

    updateWeapon(player.weapon1);

    // check if you get hit
    enimies.forEach(en => {
        if (testHit(en.weapon,player)) {
            if (!player.sheild.active){
                player.hp -= en.weapon.damage;
            }
            else {
                if (!isBetween(player,player.sheild,en,Math.PI)){
                    player.hp -= en.weapon.damage;
                }
            }
    
        }
    });

    // check if you have no healt
    // TODO MAKE THIS MORE ELEGANT
    if (player.hp < 0) {
        alert("You died!")
        document.location.reload();
    }

    targetX = screenX - transX;
    targetY = screenY - transY;
}

function drawCrosshairs(){
    let r = 2 * tileSize /3;
    ctx.drawImage(crosshairImage,targetX - r/2,targetY - r/2,r,r);
    
}

function isBetween(i, j, k, radius){
    let angleK = Math.atan2(k.y - i.y, k.x - i.x);
    let angleJ = Math.atan2(j.y - i.y, j.x - i.x);

    return angleJ >= angleK - radius/2 && angleJ <= angleK + radius/2;
}

function updateWeapon(weapon) {
    if (weapon.tic > 0) {
        weapon.tic--;
        if (weapon.tic < weapon.cool - toHit) {
            weapon.active = false;    
        }
    }
}

function drawPlayer(){
    var pImage = pRight;
    if (player.d == "left"){
        pImage = pLeft;
    }
    if (player.sheild.active){
        ctx.drawImage(pImage,player.x - tileSize/2,player.y-tileSize/2,tileSize,tileSize);
        drawWeapon(player.weapon1,player.x,player.y,targetX, targetY);
        drawSheild(player.sheild,player.x,player.y,targetX,targetY);
    }
    else {
        drawSheild(player.sheild,player.x,player.y,targetX,targetY);
        ctx.drawImage(pImage,player.x - tileSize/2,player.y-tileSize/2,tileSize,tileSize);
        drawWeapon(player.weapon1,player.x,player.y,targetX, targetY);    
    }

    drawHealth(player);
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
            hp: 20,
            hpMax:20,
            
            speed:tileSize/24,

            tarX:player.x,
            tarY:player.y,

            // textures
            sprite:skeletonR,

            weapon: createSteelSword()
        }
        enimies[i].weapon.cool = 60;
    }
}

function updateEnimies() {
    for (let i = 0; i < enimies.length; i++) {
        let en = enimies[i];
        en.tarX = player.x;
        en.tarY = player.y;

        // if player is close attack
        let pdis = getDistance(en.x,en.y,player.x,player.y);

        if (pdis < tileSize*2) {
            en.weapon.use();
        }

        if (pdis < tileSize * 10 && pdis > tileSize*1.5) {
            // move toward the player
            moveEntity(en);
        }

        // test if dead
        if (testHit(player.weapon1,en)) {
            en.hp -= player.weapon1.damage;
        }
        if (en.hp <= 0) {
            enimies.splice(i,1);
            i--;
            continue;
        }

        updateWeapon(en.weapon);
    }

    //TODO make this more elegant
    if (enimies.length <= 0) {
        alert("level Complete")
        buildMap(ground.length * 1.5);
        placeEnimies(ground.length / 20);
        setPlayer();
    }
}

function moveEntity(entity) {
    // Simple movement, 
    let dx = 0;
    let dy = 0;

    let tile = getTile(entity.x,entity.y);
    let dir = tile.previous;

    if (dir == "right") {
        dx = entity.speed;
    }
    else if (dir == "left") {
        dx = -entity.speed;
    }
    else if (dir == "down") {
        dy = entity.speed;
    }
    else if (dir == "up") {
        dy = -entity.speed;
    }

    if (onGround(entity.x +dx, entity.y)) {
        entity.x += dx;
    }
    if (onGround(entity.x, entity.y + dy)) {
        entity.y += dy;
    }
}

function drawEnimies() {
    for (let i = 0; i < enimies.length; i++) {
        let en = enimies[i];
        
        ctx.drawImage(en.sprite,en.x - tileSize/2,en.y-tileSize/2,tileSize,tileSize);
        drawWeapon(en.weapon,en.x,en.y,en.tarX,en.tarY);
        drawHealth(en);
    }
}

var healthWait = 10;
var tic = 0;
var show = true;
function drawHealth(entity){
    let width = entity.hp / entity.hpMax * tileSize;
    let height = tileSize/4;
    
    ctx.beginPath();
    ctx.rect(entity.x - tileSize/2,entity.y - tileSize/2 -height,width,height);
    ctx.fillStyle = "#EE2211";
    ctx.fill();
    ctx.closePath();
    
    if (entity.hp <= 0) {
        if (tic <= 0) {
            tic = healthWait;
            show = !show;
        }
        else {
            tic--;
        }
        if (show){
            ctx.beginPath();
            ctx.rect(entity.x - tileSize/2,entity.y - tileSize/2 -height,tileSize,height);
            ctx.fillStyle = "#EE2211";
            ctx.fill();
            ctx.closePath();
        }
    }
}

function testHit(weapon, entity, radius = tileSize){
    if (weapon.active) {
        // see if the weapon is within tilesize/2
        let dis = getDistance(weapon.x, weapon.y,entity.x,entity.y);
        return dis <= radius;
    }
}

function getDistanceBox(x,y,bx,by, width) {
    return x >= bx && x <= bx + width && y >= by && y <= by + width
}

function getDistance(x1,y1, x2,y2) {
    let disX = x2 - x1;
    let disY = y2 - y1;
    return Math.sqrt(disX * disX + disY * disY);
}
