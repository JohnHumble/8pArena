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
