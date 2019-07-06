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
var sideCliff = new Image();
sideCliff.src = "sprites/sidecliff.png";


// ground array will contain information for the ground
var ground = [];
var cliff = [];
var upperCliff = [];

var tileSize = 64;

function buildMap(size){
    ground = [];
    cliff = [];
    upperCliff = [];
    let x = 0;
    let y = 0;
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

    sortBlocks();
    buildCliffs();
}

function addGround(locX,locY, i){
    let t = randInt(4) + 1;
    ground[ground.length] = {
        x:locX,
        y:locY,
        type:t,
        index:i,
        previous:"blank",
        row:0
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

    // fill bottom and sides
    ground.forEach(tile =>{
        let x = tile.x;
        let y = tile.y;
        // check bottom
        if (!isTile(x,y + tileSize,ground)) {
            addUpper(x,y,"bottom");
            
            if (!isTile(x,y+tileSize,cliff)){
                addUpper(x,y+tileSize,"side");
            }
        }
        // check sides
        if (!isTile(x + tileSize,y,ground) && !isTile(x + tileSize,y,cliff)) {
            addUpper(x + tileSize,y,"side");
        }
        if (!isTile(x - tileSize,y,ground) && !isTile(x - tileSize, y, cliff)) {
            addUpper(x -tileSize,y,"side");
        }
    });

    // fill in cliff sides
    cliff.forEach(tile =>{
        let x = tile.x;
        let y = tile.y;

        // check sides
        if (!isTile(x + tileSize,y,ground) && !isTile(x + tileSize,y,cliff)) {
            addUpper(x + tileSize,y,"side");
        }
        if (!isTile(x - tileSize,y,ground) && !isTile(x - tileSize, y, cliff)) {
            addUpper(x -tileSize,y,"side");
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

function addUpper(locX,locY,dir) {
    upperCliff[upperCliff.length] = {
        x:locX,
        y:locY,
        d:dir
    }
}

function drawGround(){
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
/* 
        ctx.font = "25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("i:"+tile.index,tile.x,tile.y+25);
        ctx.fillStyle = "red";
        ctx.fillText(tile.previous,tile.x,tile.y + 51);
        */
    });
}

function drawCliff() {
    cliff.forEach(tile => {
        let cimage;
        if (tile.d == "up"){
            cimage = cliff1;
            if (tile.type == 2){
                cimage = cliff2;
            }
        }
        else if (tile.d == "side"){
            cimage = sideCliff;
        }
        else{
            cimage = bottomCliff;
        }
        ctx.drawImage(cimage,tile.x,tile.y,tileSize,tileSize);
    });

}

function drawUpper() {
    upperCliff.forEach(tile => {
        let cimage;
        if (tile.d == "side"){
            cimage = sideCliff;
        }
        else{
            cimage = bottomCliff;
        }
        ctx.drawImage(cimage,tile.x,tile.y,tileSize,tileSize);
    })
}

function isTile(x, y,tile){
    for (let i = 0; i < tile.length; i++){
        if (tile[i].x == x && tile[i].y == y){
            return true;
        }
    }
    return false;
}

function onGround(x,y){

    return getTile(x,y) != null;

//    for (let i = 0; i < ground.length; i++){
//        let tile = ground[i];
//        if (x >= tile.x && x <= tile.x + tileSize && y >= tile.y && y <= tile.y + tileSize) {
//            return true;
//        }
//    }
//    return false;
}

function getTile(x,y){
    // find x first
    if (ground.length < 1){
        return null;
    }
    // liniarly find the y quardinate
    for(let i = 0; i < ground.length; i++){
        let tile = ground[i];
        // test y 
        if (tile.y + tileSize <= y) {
            // go to next row
            i += tile.row; 
            continue;
        }

        // see if we match the y
        if (tile.y + tileSize >= y) {
            
            if (isOnGroundTile(tile,x,y)) {
                return tile;
            }
            else {
                   
            }
        
        }
    }
    return null;
}

function isOnGroundTile(tile, x, y) {
    return x >= tile.x && x < tile.x + tileSize && y >= tile.y && y < tile.y + tileSize
}

function randInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

var queue = [];
function findPath(playerX, playerY) {
    // get the block that the player is on
    let tile = getTile(playerX,playerY);
    
    findPath(tile);
}

function findPath(tile) {
    tile.previous = "c";
    queue = [];

    // add to the queue
    queue.push(tile);

    let i = 0;
    // pop from the queue and add until empty
    while (i < queue.length) {
        growQueue(i);
        i++;
    }
}

function growQueue(i){
    let tile = queue[i];
    // get 4 adjacent tiles
    let top = getTile(tile.x,tile.y-tileSize);
    let bottom = getTile(tile.x,tile.y+tileSize);
    let left = getTile(tile.x - tileSize,tile.y);
    let right = getTile(tile.x +tileSize,tile.y);
    
    addQueue(top,"down");
    addQueue(bottom,"up");
    addQueue(left,"right");
    addQueue(right,"left");
}

function addQueue(tile,dir){
    if (tile != null) {
        if (tile.previous == "blank") {
            tile.previous = dir;
            queue.push(tile);
        }
    }
}

function resetPath(){
    ground.forEach(tile => {
        tile.previous = "blank";
    });
}

function sortBlocks(){
    ground.sort(comparitor);
    
    // get the row size
    setRowValues();
}

function comparitor(a,b){
    let y = a.y - b.y;
    if (y === 0){
        return a.x - b.x;
    }
    return y;
}

function setRowValues() {
    if (ground.length < 1){
        return;
    }
    ground[0].index = 0;
    let y = ground[0].y;
    let start = 0;
    let end = 0;
    for (let i = 1; i < ground.length; i++){
        ground[i].index = i;
        if (ground[i].y == y) {
            end++;
        }
        else{
            fillRow(start,end);
            y = ground[i].y;
            start = i;
            end = i;
        }
    }
}

function fillRow(startIndex, endIndex){
    for (let i = startIndex; i <= endIndex; i++) {
        ground[i].row = endIndex - i;
    }
}