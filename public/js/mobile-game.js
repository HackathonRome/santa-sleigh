var socket = io.connect(window.location.hostname);


var stage = new Kinetic.Stage({
  container: 'container-mobile',
  width: screen.width,
  height: screen.height
});
var startX = 0;
var startY = 0;

var tween;
var layer = new Kinetic.Layer();
var rectX = stage.getWidth() / 4 - 50;
var rectY = stage.getHeight() / 4 - 25;

var xOne = stage.getWidth()/4 - 50;
var yOne = stage.getHeight()/3 - 25;

var xTwo = stage.getWidth()/4*3-50;
var yTwo = (stage.getHeight()/3)*2 -25;

var xThree = (stage.getWidth()/4)*3 - 50;
var yThree = (stage.getHeight()/3)-25;

var xFour = stage.getWidth()/4 - 50;
var yFour = stage.getHeight()/3*2 - 25;

var posObj = {
  'one': {'x':xOne, 'y':yOne},
  'two': {'x':xTwo, 'y':yTwo},
  'three': {'x':xThree, 'y':yThree},
  'four': {'x':xFour, 'y':yFour}
};

var box = new Kinetic.Rect({
  x: stage.getWidth()/4 - 50,
  y: stage.getHeight()/3 - 25,
  width: 100,
  height: 50,
  fill: '#00D2FF',
  stroke: 'black',
  name:'one',
  strokeWidth: 4,
  draggable: true
});

var box2 = new Kinetic.Rect({
  x: stage.getWidth()/4*3-50 ,
  y: (stage.getHeight()/3)*2 -25,
  width: 100,
  height: 50,
  name:'two',
  fill: '#000000',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true
});

var box3 = new Kinetic.Rect({
  x: (stage.getWidth()/4)*3 - 50,
  y: (stage.getHeight()/3)-25,
  width: 100,
  height: 50,
  name:'three',
  fill: '#FF5050',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true
});

var box4 = new Kinetic.Rect({
  x: stage.getWidth()/4 - 50,
  y: stage.getHeight()/3*2 - 25,
  width: 100,
  height: 50,
  name:'four',
  fill: '#33CC33',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true
});

createRect(box);
createRect(box2);
createRect(box3);
createRect(box4);


stage.add(layer);

function createRect(itemToClone){
  var na = itemToClone.getName().toString();
  var xy = posObj[na];
  var newItem =new Kinetic.Rect({
    x: xy['x'],
    y: xy['y'],
    width: 100,
    height: 50,
    name:na,
    id:itemToClone.getName(),
    fill: itemToClone.getFill(),
    stroke: 'black',
    strokeWidth: 4,
    draggable: true
  });

  newItem.on('dragstart', function(){
    startX = this.getX();
    startY = this.getY();
    createRect(this);
  });
  newItem.on('dragend', function() {
    var that = this;
    var dx = (that.getX() - startX) < 0 ? -screen.width*2 : screen.width*2;
    startEase(that, dx);
    var direction = (dx > 0) ? 'right' : 'left';
    var pack = {
      color: that.getFill(),
      dir: direction,
      action: 'fire'
    }
    socket.emit("send",  JSON.stringify(pack));
  });
  layer.add(newItem);
}


function startEase(item, dxparam){
  dx = dxparam;
  tween = new Kinetic.Tween({
    node: item, 
    duration: 1,
    opacity:0,
    x: dx,
    y: -1000,
    scaleX: 0.5,
    onFinish: function() {
      item.remove();
    }
  });
  tween.play();
}

function calculateAngle(xt, xo, yt, yo,x){
  var y = ((yt^2-yo)/(xt^2-xo))*(x-xo)+yo;
  return y;
}


var gamma = 0;
var calulcated = 0;


if (window.DeviceMotionEvent==undefined) {
  alert("Not supported");
}else {             
  window.ondeviceorientation = function(event) {
    if(!phone_off){
      gamma = Math.round(event.gamma);
      if(gamma > 5){
        calculated = 1;
      }else if(gamma <-5){
        calculated = -1;
      }else{
        calculated = 0;
      }

      var pack = {
        color: '',
        dir: calculated,
        action: 'move'
      }
      socket.emit("send",  JSON.stringify(pack));
    }
  }                
  
} 
