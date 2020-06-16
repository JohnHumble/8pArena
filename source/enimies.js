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
      {}  en.weapon.use();
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
