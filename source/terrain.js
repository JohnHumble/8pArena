var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// load images;
var ground1 = new Image();
ground1.src = "sprites/ground1.png";
var ground2 = new Image();
ground2.src = "sprites/ground2.png";
var ground3 = new Image();
ground3.src = "sprites/ground3.png";
var ground4 = new Image();
ground4.src = "sprites/ground4.png";
var cliff1 = new Image();
cliff1.src = "sprites/cliff1.png";
var cliff2 = new Image();
cliff2.src = "sprites/cliff2.png";
var bottomCliff = new Image();
bottomCliff.src = "sprites/bottomcliff.png";
var rightCliff = new Image();
rightCliff.src = "sprites/rightcliff.png";
var leftCliff = new Image();
leftCliff.src = "sprites/leftcliff.png";


// ground array will contain information for the ground
var ground = [];
var cliff = [];

var tileSize = 64;

function buildMap(size){
    let x = 320;
    let y = 320;
    let d = randInt(4);
    let i = 0;
    while(size > 0) {
        if (!isTile(x,y,ground)){
            addGround(x,y,i);
            size--;
            i++;
            d = randInt(4);
        }
        
        if (d == 0){
            x += tileSize;
        }
        else if (d == 1){
            x -= tileSize;
        }
        else if (d == 3){
            y += tileSize;
        }
        else{
            y -= tileSize;
        }
    }

    buildCliffs();
}

function addGround(locX,locY, i){
    let t = randInt(4) + 1;
    ground[ground.length] = {
        x:locX,
        y:locY,
        type:t,
        index:i
    };
}

function buildCliffs(){
    // get top cliff first
    ground.forEach(tile => {
        let x = tile.x;
        let y = tile.y -tileSize;
        if (!isTile(x,y,ground)){
            addCliff(x,y,"up");
        }
    });

    // fill bottom
    ground.forEach(tile =>{
        let x = tile.x;
        let y = tile.y;
        // check bottom
        if (!isTile(x,y + tileSize,ground)) {
            addCliff(x,y,"bottom");
        }
    });
}

function addCliff(locX,locY,dir){
    let t = randInt(2)+1;
    cliff[cliff.length] = {
        x:locX,
        y:locY,
        type:t,
        d:dir
    }
}

ground1.onload = function() {
    buildMap(100);
    drawGround();
}

var transX = 0;
var transY = 0;

document.addEventListener("keydown", keyDownHandler,false);

function keyDownHandler(e) {
    let rate = tileSize;
    if (e.key == "ArrowRight") {
        transX -= rate;
    }
    else if (e.key == "ArrowLeft") {
        transX += rate;
    }
    else if (e.key == "ArrowUp") {
        transY += rate;
    }
    else if (e.key == "ArrowDown") {
        transY -= rate;
    }
}

function drawGround(){
    ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset

    ctx.translate(transX,transY);
    ground.forEach(tile => {
        let i = ground4;
        if (tile.type == 1) {
            i = ground1;
        }
        else if (tile.type == 2) {
            i = ground2;
        }
        else if (tile.type == 3) {
            i = ground3;
        }
        ctx.drawImage(i,tile.x,tile.y,tileSize,tileSize);
    });

    cliff.forEach(tile => {
        let cimage;
        if (tile.d == "up"){
            cimage = cliff1;
            if (tile.type == 2){
                cimage = cliff2;
            }
        }
        else if (tile.d == "left"){
            cimage = leftCliff;
        }
        else if (tile.d == "right"){
            cimage = rightCliff;
        }
        else{
            cimage = bottomCliff;
        }
        ctx.drawImage(cimage,tile.x,tile.y,tileSize,tileSize);
    });

    requestAnimationFrame(drawGround);
}

function isTile(x, y,tile){
    for (let i = 0; i < tile.length; i++){
        if (tile[i].x == x && tile[i].y == y){
            return true;
        }
    }
    return false;
}

function randInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}