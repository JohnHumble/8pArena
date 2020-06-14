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
  if (!player.sheild.active) {
    player.weapon1.use();
  }
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