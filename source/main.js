var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var transX = 0;
var transY = 0;

// input control
document.addEventListener("keydown", keyDownHandler,false);
document.addEventListener("keyup", keyUpHandler,false);

function keyDownHandler(e) {
    console.log(e);
    movePlayer(e);
}

function keyUpHandler(e) {
    stopPlayer(e);
}

function draw(){
    // update
    playerUpdate();

    ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset

    transX = -(player.x - canvas.width/2);
    transY = -(player.y - canvas.height/2);

    ctx.translate(transX,transY);

    drawGround();
    drawCliff();

    drawPlayer();
    // draw entites here

    drawUpper();

    requestAnimationFrame(draw);
}

// get things started
function loadLevel(size){
    buildMap(size);
    draw();
}
loadLevel(100);