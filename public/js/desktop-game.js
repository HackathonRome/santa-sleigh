window.onload=function(){
  var mapWidth = 1000;
  var mapHeight = 600;
  var tileWidth = 50;
  var tileHeight = 50;
  var tiles = [];
  function Map() {
    createBackground();
    this.width = mapWidth;
    this.height = mapHeight;
    this.x = 0;
    this.y = 0;
    amountOfTiles = (mapWidth/tileWidth)*(mapHeight/tileHeight);
    for (var i = 0; i < amountOfTiles; i++) {
      tiles.push(new Tile(i));
    }

    xPos = 0-tileWidth;
    tileCount = 1;
    rows = 0;
    tilesPerRow = mapWidth/tileWidth;
    for (i in tiles) {
      t = tiles[i];
      xPos += t.width;
      t.x = xPos;

      if (tileCount == tilesPerRow) {
        t.y += t.height*rows;
        rows++;
        tileCount = 1;
        xPos = 0-tileWidth;
      } else {
        t.y = tileHeight*rows;
        tileCount++;
      }
      tileToContext(t);
    }
  }

  function Tile(id) {
    this.id = id;
    this.width = tileWidth;
    this.height = tileHeight
    this.x = 0;
    this.y = 0;
    this.fill = 'yellow';
  }

  function tileToContext(tile) {
    context.beginPath();
    context.rect(tile.x, tile.y, tile.width, tile.height);
    context.fillStyle = tile.fill;
    context.fill();

    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
  }

  function createBackground() {
    backgroundLayer = new Kinetic.Layer();
    var bg = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: 'gray'
    });

    backgroundLayer.add(bg);
    stage.add(backgroundLayer);
  }

  function Player() {
    this.id = 'player';
    this.x = 180;
    this.y = 500;
    this.width = 40;
    this.height = 100;

    this.damage = 15;

    this.health = 500;

    this.sprite = new Kinetic.Rect({
      x: this.x,
      y: this.y-10, 
      width: this.width,
      height: this.height,
      fill: '#663300',
      name: 'sprite'
    });

    this.move = function() {
      spr = this.sprite;


      if (left == true) {
        spr.setX(spr.getX()-(1*speed));
        if (spr.getX() <= kHouseWidth + 10 ) {
          spr.setX(kHouseWidth + 10);
        }
      }

      if (right == true) {
        spr.setX(spr.getX()+(1*speed));
        if (spr.getX() >= stage.getWidth()-kHouseWidth -50) {
          spr.setX(stage.getWidth()-kHouseWidth -50);
        }
      }

      if (enemies.length > 0) {
        enemyCollision(this);
      }
    }

    this.collide = function(object) {
      damage = 0;
  //  console.log(object);

  if (object.id == 'enemy') {
    damage = 100;
  } else if(object.id == 'bullet') {
    damage = bullet.damage;
  }

  this.health -= damage;
  if (this.health <= 0) {
    //  youLose();
  }
}

this.flickr = function() {
  this.sprite.setOpacity(0.5);
  playerLayer.draw();
  var enem = this.sprite;
  setTimeout(function() {
    enem.setOpacity(1);
    playerLayer.draw();
  }, 100);
}

this.draw = function() {
  this.move();
  playerLayer.draw();
}
}

var enemyWidth = 25;
var enemyHeight = 25;

//Elements size
kHouseWidth = 80;
kHouseHeight = 60;

boxColor = "#ff0000";
bulletColor = "#ffffff";


function Enemy(number,x,y) {

  this.number = number;
  this.id = 'enemy';
  
  this.x = x;
  this.y = y;

  this.health = 1000000;

  this.sprite = new Kinetic.Rect({
    x: this.x,
    y: this.y,
    width: kHouseWidth,
    height: kHouseHeight,
    fill: 'rgb(220,220,220)',
    listener: false,
    opacity: 1
  });

  this.collide = function(arrayIndex, bullet) {
    if (bullet) {
      this.health -= player.damage;
    }

    if (this.health <= 0) {
      this.sprite.remove();
      enemies.splice(arrayIndex, 1);
    }
    this.draw();
    countEnemies();
  }

  this.draw = function() {
    enemyLayer.draw();
  }

  this.flickr = function() {
    this.sprite.setOpacity(0.5);
    enemyLayer.draw();
    var enem = this.sprite;
    setTimeout(function() {
      enem.setOpacity(1);
      enem.setFill(boxColor);
      enemyLayer.draw();
    }, 100);
  }

  this.shoot = function() {
    /*if(this.bullets.length > 0) {
      for (var i in this.bullets) {
        this.bullets[i].draw();
      }
    }*/
  }

  this.bullets = [];
}


var enemies = [];
enemyLayer = new Kinetic.Layer();

function createEnemies(amount) {
  //Create a layer to spawn the enemies on
  enemyLayer = new Kinetic.Layer();
  
  //Loop through the amount wanted.
  for (var i = 0; i < amount; i++) {
    enemy = new Enemy(i, 375, 250);

    //createEnemyBullet(enemy);
    //push the object in an array and add it to the newly made layer
    enemies.push(enemy);
    enemyLayer.add(enemy.sprite);
  }
  
  stage.add(enemyLayer);
}

function countEnemies() {
  if (enemies.length == 0) {
    youWin();
  }
}

function createEnemyBullet(enemy) {
  var blt = new Enemybullet(player.sprite.getX(), player.sprite.getY(), enemy.sprite);
  ammoLayer.add(blt.sprite);
  enemy.bullets.push(blt);
}


var up = false;
var down = false;
var left = false;
var right = false;
function keyUp(e) {
  keyCode = (e.keyCode ? e.keyCode : e.which);
  if (keyCode == 37 || keyCode == 65) {
    left = false;
  }

  if (keyCode == 38 || keyCode == 87) {
    up = false;
  }

  if (keyCode == 39 || keyCode == 68) {
    right = false;
  }

  if (keyCode == 40 || keyCode == 83) {
    down = false;
  }
}

function forceStopMoving() {
  left = false;
  up = false;
  right = false;
  down = false;
}


function keyDown(e) {
  keyCode = (e.keyCode ? e.keyCode : e.which);
  if (keyCode == 37 || keyCode == 65) {
    left = true;
  }

  if (keyCode == 38 || keyCode == 87) {
    up = true;
  }

  if (keyCode == 39 || keyCode == 68) {
    right = true;
  }

  if (keyCode == 40 || keyCode == 83) {
    down = true;
  }
}

var bullets = [];
var isFiring = false;
function mouseDown(x) {
  timer = 0;
  //isFiring = true;
  fireBullet(x);
}

var cursorRange = 150;

function mouseMove(e) {
  if (cursor) {
    if (e.clientX && e.clientY) {
      cursorBoundingBox(e.clientX, e.clientY);
    }
  }
}

function cursorBoundingBox(x, y) {
  var newX = x;
  var newY = y;
/*  if (sprite.getX()-x > cursorRange || sprite.getX()-x < -cursorRange) {
    newX = (sprite.getX() > x) ? sprite.getX()-cursorRange : sprite.getX()+cursorRange;
  }

  if (sprite.getY()-y > cursorRange || sprite.getY()-y < -cursorRange) {
    newY = (sprite.getY() > y) ? sprite.getY()-cursorRange : sprite.getY()+cursorRange;
  }

  */
  cursor.setPosition(newX, newY);
  cursorLayer.draw();
}

function createCursor() {
  cursor = new Kinetic.Rect({
    x: 400,//stage.getWidth()/2,
    y: 250,//stage.getHeight()/2,
    width: 10,
    height: 10,
    fill: 'yellow',
    name: 'cursor',
    alwaysOnTop: true
  });
  cursorLayer = new Kinetic.Layer();
  cursorLayer.add(cursor);
  stage.add(cursorLayer);
}



function mouseUp() {
  isFiring = false;
}

/**
* BULLET
**/

function Bullet(destinationX, destinationY) {
  this.id = 'bullet';
  this.x = sprite.getX()+(sprite.getWidth()/2);
  this.y = sprite.getY()+(sprite.getHeight()/2);

  var targetX = destinationX - this.x,
  targetY = destinationY - this.y,
  distance = Math.sqrt(targetX * targetX + targetY * targetY);

  this.velX = (targetX / distance) * attackSpeed;
  this.velY = (targetY / distance) * attackSpeed;

  this.finished = false;
  
  this.sprite = new Kinetic.Rect({
    x: this.x,
    y: this.y,
    width: 30,
    height: 30,
    fill: bulletColor,
    name: 'projectile'
  });

  this.draw = function(index) {
    var mayDelete = false;

    this.x += this.velX;
    this.y += this.velY;

    this.sprite.setAbsolutePosition(this.x, this.y);


    if(enemyCollision(this) == true) {
      mayDelete = true;
    }

    if (bulletLeftField(this.sprite) == true) {
      mayDelete = true;
    }

    if (mayDelete == true) {
      this.sprite.remove();
      bullets.splice(index, 1);
    }

    ammoLayer.draw();
  }
}
function Enemybullet(destinationX, destinationY, enemySprite) {
 
  this.id = 'bullet';
  this.x = enemySprite.getX()+(enemySprite.getWidth()/2);
  this.y = enemySprite.getY()+(enemySprite.getHeight()/2);

  var targetX = destinationX - this.x,
  targetY = destinationY - this.y,
  distance = Math.sqrt(targetX * targetX + targetY * targetY);

  this.velX = (targetX / distance) * 5;
  this.velY = (targetY / distance) * 5;

  this.finished = false;
  
  this.sprite = new Kinetic.Circle({
    x: this.x,
    y: this.y, 
    radius: 3,
    fill: 'black',
    name: 'enemyProjectile'
  });

  this.draw = function(index) {
    
    var mayDelete = false;

    this.x += this.velX;
    this.y += this.velY;

    this.sprite.setAbsolutePosition(this.x, this.y);
/*
    if(enemyCollision(this) == true) {
      mayDelete = true;
    }*/

    if (bulletLeftField(this.sprite) == true) {
      mayDelete = true;
    }

    if (mayDelete == true) {
      this.sprite.remove();
      enemies[index].bullets.splice(0, 1);
      createEnemyBullet(enemies[index]);
    }



    ammoLayer.draw();
  }
}
function bulletLeftField(projectile) {
  if (projectile.getX() < 0
    ||
    projectile.getX() > stage.getWidth()
    ||
    projectile.getY() < 0
    ||
    projectile.getY() > stage.getHeight()) {
    return true;
}

return false;
}

function fireBullet(x) {
  bullet = new Bullet(x, 400);
  ammoLayer.add(bullet.sprite);
  bullets.push(bullet);
}

function enemyCollision(object) {
  var collider =  object.sprite;
  if (enemies.length > 0) {
    for(var index in enemies) {
      var hitFrameTopLeft = {x: enemies[index].sprite.getX(), y: enemies[index].sprite.getY()};
      var hitFrameTopRight = {x: enemies[index].sprite.getX()+enemies[index].sprite.getWidth(), y: enemies[index].sprite.getY()};

      var hitFrameBottomLeft = {x: enemies[index].sprite.getX(), y: enemies[index].sprite.getY()+enemies[index].sprite.getHeight()};
      var hitFrameBottomRight = {x: enemies[index].sprite.getX()+enemies[index].sprite.getWidth(), y: enemies[index].sprite.getY()+enemies[index].sprite.getHeight()};

      var projectileX = collider.getX();
      var projectileY = collider.getY();

      if (projectileX > hitFrameTopLeft.x && projectileX < hitFrameTopRight.x
        && projectileY > hitFrameTopLeft.y && projectileY < hitFrameBottomRight.y) {
        if (object.id == 'bullet') {
          enemies[index].flickr();
          enemies[index].collide(index, bullet);
        } else {
          player.flickr();
          player.collide(enemies[index]);
        }

        return true;
      }
    }

  }
  return false;
}

init();
var speed = 5;
function init() {
  //Hide the cursor
  //document.body.style.cursor = "none";
  
  //Initiate canvas/stage
  stage = new Kinetic.Stage({
    container: 'container-desktop',
    width: 400,//document.width,
    height: 600 //document.height
  });

  //Create the background
  createBackground();

  //Creates the cursor in which way the bullets fly
  createCursor();
  cursor = cursorLayer.get('.cursor')[0];

  //Add a layer to append the bullets to
  ammoLayer = new Kinetic.Layer();
  stage.add(ammoLayer);

  //Create a player and add it to a special layer.
  player = new Player();
  playerLayer = new Kinetic.Layer();
  playerLayer.add(player.sprite);
  stage.add(playerLayer);
  //Initiate a variable for the sprite(The visual object)
  sprite = playerLayer.get('.sprite')[0];

  //Create enemies. INT to define the amount of enemies to be randomly spawned.
  //createEnemies(1);

  //Start key+mouse event listeners
  startListeners();
  

  //Start the loop with a caching system
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  (function animloop(){
    requestAnimFrame(animloop);
    refreshLoop();
  })();

  dynamicFields();

}

function createHouse(i,x,y){

  enemy = new Enemy(i, x, y);

  //createEnemyBullet(enemy);
  //push the object in an array and add it to the newly made layer
  enemies.push(enemy);
  enemyLayer.add(enemy.sprite);

  return enemy;
};

function dynamicFields(){

  // in ms
  var addHouseOnLeftSide = function(){
    var house = createHouse(0,0,-kHouseHeight);
  }

  var addHouseOnRightSide = function(){
    var house = createHouse(0,stage.getWidth()-kHouseWidth,-kHouseHeight);
  }

  var generateRandomHorizon = function () {
    var randNum = Math.floor(Math.random() * 4);
    switch(randNum)
    {
      case 0:
      addHouseOnLeftSide();
      break;
      case 1:
      addHouseOnRightSide();
      break;
      case 2:
      addHouseOnRightSide();
      addHouseOnLeftSide();
      default:
    } 
  }

  gameLoop = new Kinetic.Animation(function(frame) {

    for(i=0; i<enemies.length; i++) {
      var house = enemies[i].sprite;
      house.setY(house.getY()+5);
      if(house.getY() > stage.getHeight()){
        house.remove();
        enemies.splice(i,1);
      }
    }

  }, enemyLayer);
  gameLoop.start();
  setInterval(generateRandomHorizon,500);

  stage.add(enemyLayer);
}

//Timer is used to control the amount of bullets fired
var timer = 0;
//The speed of when a bullet has to be fired
var attackSpeed = 8;

var enemyShootTimer = 0;
var enemyShootTime = 300;
function refreshLoop() {
  enemyShootTimer++;
  //When a mousedown occurs the isFiring is set to true. In this loop it'll make the player keep firing until a mouseup event
  if (isFiring == true && timer > attackSpeed) {
    fireBullet();
    timer = 0;
  }

  //If there are bullets the bullets should be redrawn individually
  if (bullets.length > 0) {
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].draw(i);
    }
  }

  //If there are enemies they should be checked
  if (enemies.length > 0) {
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].draw();
      if (enemies[i].bullets[0]) {
        enemies[i].bullets[0].draw(i);
      }
    }
  }

  if (enemyShootTimer > enemyShootTime) {
    /*for (var i = 0; i < enemies.length; i++) {
      createEnemyBullet(enemies[i]);
    }*/
    enemyShootTimer = 0;
  }
  cursorBoundingBox(cursor.getX(), cursor.getY());
  player.draw();
  timer++;
}

function youWin() {
  alert('You win');
  stopListeners();
}

function youLose() {
  alert('You lose');
  stopListeners();
}

function stopListeners() {
  document.removeEventListener('keyup', keyUp, false);
  document.removeEventListener('keydown', keyDown, false);

  stage.off('mousedown');

  stage.off('mouseup');

  stage.off('mousemove');

  forceStopMoving();

  document.body.style.cursor = "cursor";

  if (enemies.length > 0) {
    for (var i in enemies) {
      enemyLayer.remove(enemies[i]);
    }
  }
}

function startListeners() {
  document.addEventListener('keyup', keyUp, false);
  document.addEventListener('keydown', keyDown, false);

  stage.on('mousedown', function(e) {
    mouseDown(280);
  });

  stage.on('mouseup', function(e) {
    mouseUp();
  });

  /*stage.on('mousemove', function(e) {
    mouseMove(e);
  });*/

}

fireBulletWithPositionAndColor = function (position, color){

  if(position == "left"){
    bulletColor = color;
    mouseDown(90);
    boxColor = color;
  }else{
    bulletColor = color;
    mouseDown(280);
    boxColor = color;
  }
}

steer = function(direction){
  if (direction == -1) {
    left = true;
    right = false;
  }

  if (direction == 1) {
    left = false;
    right = true;
  }

  if (direction == 0) {
    left = false;
    right = false;
  }
}


}
