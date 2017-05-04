// CURRENT IDEA IS TO HAVE A CAMERA GAME, HANDS KNOCK AWAY ENEMIES
// ADD POINT TRACKING INSTEAD OF FACE TRACKING

var stageSetting = 1;
var score = 0;
var oldFrameCount = 999909;
var stop = false;

var startButton = {
  x : 0,
  y : 0,
  width : 200,
  height : 75,
  fill : 0
}

var video;
var vidOn = false;
var prevFrame;
var currFrame;
var outFrame;
var tracker;
var facePoint = {
      x: 0,
      y: 0
    };
var threshold = 0.073;
var counter = 0; //used as a temp value to stop infinite spawning of ufos
var grid;

var angle;

//UFO variables
var ufoSpeed = 1.5;
var ufoSize = 60; //the starting size value for ufos
var sizeRange;  //the different values used to manipulate ufo sizes so that there are different sized ufos

//ARRAYS
var ufoArray = []; //stores the ufo objects
var startPos = [];  //array of x axis start positions of ufos

function preload() {
  ufo = loadImage("assets/ufo.png");
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  // if(Index == 'undefined'){
  //   Index = 1;
  // }
  startButton.x = canvas.width/2;
  startButton.y = canvas.height/2;

  video = createCapture(VIDEO);
  video.hide();
  grid = new Grid(canvas.width, canvas.width);
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(video.elt);

  navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  navigator.getMedia({video: true}, function() {
    vidOn = true;
    console.log(vidOn);
  }, function() {
    vidOn = false;
    console.log(vidOn);
  });
}

function draw() {

  if(stageSetting == 1){
    background(255);
    textSize(30);
    fill(0);
    textStyle(BOLD);
    textAlign(CENTER);
    text("INVADERS OF YOUR BRAIN", canvas.width/2, canvas.height/4);

    fill(startButton.fill);
    rectMode(CENTER);
    rect(startButton.x, startButton.y, startButton.width, startButton.height);
    fill(255);
    textSize(25);
    text("PLAY", startButton.x, startButton.y+13);
  }

  if(stageSetting == 2){

    if(vidOn == true && stop == false){
      oldFrameCount = frameCount;
      console.log(oldFrameCount = frameCount);
      stop = true;
    }

    if(vidOn == true && frameCount - oldFrameCount == 600){
        console.log("ON!");
        tracker.init(pModel);
        tracker.start(video.elt);
    }

    if(score>50){
      stageSetting=3
    }

    background(255);

    image(video, 0, 0, canvas.width, canvas.height);
    video.loadPixels();
    var positions = tracker.getCurrentPosition();

    noFill();
    stroke(255);
    beginShape();
    for (var i=0; i<positions.length; i++) {
      vertex(positions[i][0], positions[i][1]);
    }
    endShape();

    noStroke();
    for (var i=0; i<positions.length; i++) {
      fill(map(i, 0, positions.length, 0, 360), 50, 100);
      // ellipse(positions[i][0], positions[i][1], 4, 4);
      // text(i, positions[i][0], positions[i][1]);
      text("22", positions[22][0], positions[22][1]);
      text("18", positions[18][0], positions[18][1]);
    }

    if(positions.length > 0) {
      var mouthLeft = createVector(positions[44][0], positions[44][1]);
      var mouthRight = createVector(positions[50][0], positions[50][1]);
      var smile = mouthLeft.dist(mouthRight);
      // rect(20, 20, smile * 3, 20);
      }

      if (positions[18]) {
        //console.log("X: "+positions[18][0]);
        //console.log("Y: "+positions[18][1]);
        facePoint.x = positions[18][0];
        facePoint.y = positions[18][1];
      }

      //facePoint = positions[18];
      //ellipse(positions[18][0], height/2, 10,10);

    if(counter == 0 || ufoArray.length == 0){
      for(var i=0; i<5; i++){
        sizeRange = ufoSize * random(0.8, 1.5);
        ufoArray.push(drawUfo(random(0,canvas.width), random(0, canvas.height - 30), sizeRange*1.34, sizeRange));
      }
      counter +=1;
    }

    //console.log(ufoArray[0].startX);
    //console.log("facePoint: " +facePoint.x);

    if(vidOn == true){
      moveUfos();
    }
    //console.log("1");
    for (var i = 0; i < ufoArray.length; i++) {
      //console.log("2");
      if(ufoArray[i].x  > facePoint.x &&
        ufoArray[i].x  < facePoint.x + 50 &&
        ufoArray[i].y > facePoint.y &&
        ufoArray[i].y < facePoint.y +50)
      {
        console.log("HIT");
        if(score>0){
          score -=10;
        }
      }
    }
    var w = video.width/8;
    var h = video.height/8;

    currFrame = createImage(w, h);
    currFrame.copy(video, 0, 0, video.width, video.height, 0, 0, w, h);
    currFrame.filter("gray");
    currFrame.filter("blur", 1);
    currFrame.loadPixels();

    outFrame = createImage(w, h);
    outFrame.copy(video, 0, 0, video.width, video.height, 0, 0, w, h);
    outFrame.loadPixels();

    //Prevents running the loop before prevFrame is defined as the loop uses prevFrame's pixels
    if(typeof prevFrame !== 'undefined'){
      prevFrame.loadPixels();

      for(i=0; i < currFrame.width; i++){
        for(j=0; j < currFrame.height; j++){

          var x = Math.ceil( (index % (cat.width * 4)) / 4 );

          var y = Math.floor( index / (cat.width * 4) );
          var newX = map(x, 0, cat.width, cat.width, 0);
          // var newY = map(y, 0, cat.height, cat.height, 0);

          var newIndex = parseInt( (newX + (y * currFrame.width)) * 4);

          outFrame.pixels[newIndex] = currFrame.pixels[index];
          outFrame.pixels[newIndex + 1] = currFrame.pixels[index + 1];
          outFrame.pixels[newIndex + 2] = currFrame.pixels[index + 2];
          outFrame.pixels[newIndex + 3] = currFrame.pixels[index + 3];

          //this calculates the position of the red component
          var index = (i + (j*currFrame.width))*4;

          var r = currFrame.pixels[index];
          var g = currFrame.pixels[index + 1];
          var b = currFrame.pixels[index + 2];
          var a = currFrame.pixels[index + 3];

          //red value in the prevFrame image
          var r2 = prevFrame.pixels[index];

          //distance calculation between the red value in the currFrame and the prevFrame
          //this is then used to detect movement
          var d = abs(r - r2);

          //this difference is then stored in a seperate image
          outFrame.pixels[index] = outFrame.pixels[index+1] = outFrame.pixels[index+2] = d;
          outFrame.pixels[index+3] = 255;
        }
      }
    }
    //end of loop

    outFrame.updatePixels();
    outFrame.filter("threshold", threshold);

    prevFrame = createImage(w, h);
    prevFrame.copy(currFrame, 0, 0, currFrame.width, currFrame.height, 0, 0, currFrame.width, currFrame.height);

    // image(currFrame, video.width, 0);
    // image(outFrame, video.width, currFrame.height);

    //updates the grid with the image that stores movement changes
    grid.update(outFrame);

    fill(0);
    textSize(20);
    text("Score: " + score, 100, 15)
  }

  if(stageSetting == 3){
    background(255);
    textSize(30);
    fill(0);
    textStyle(BOLD);
    textAlign(CENTER);
    text("GAME OVER", canvas.width/2, canvas.height/4);

    fill(startButton.fill);
    rectMode(CENTER);
    rect(startButton.x, startButton.y, startButton.width, startButton.height);
    fill(255);
    textSize(25);
    text("REPLAY", startButton.x, startButton.y+13);
  }
}
//end of draw

function mousePressed(){
  if(stageSetting == 1 &&
    mouseX>startButton.x - startButton.width/2 &&
    mouseX<startButton.x + startButton.width/2 &&
    mouseY>startButton.y - startButton.height/2 &&
    mouseY<startButton.y + startButton.width/2)
    {
      //console.log("PRESSED");
      // startButton.fill = 100;
      stageSetting = 2;
    }
    if(stageSetting == 3 &&
      mouseX>startButton.x - startButton.width/2 &&
      mouseX<startButton.x + startButton.width/2 &&
      mouseY>startButton.y - startButton.height/2 &&
      mouseY<startButton.y + startButton.width/2)
      {
        //console.log("PRESSED");
        // startButton.fill = 100;
        score=0;
        stageSetting = 2;
      }
}

function drawUfo(_x, _y, _width, _height) {
  return{
    x: _x,
    y: _y,
    width: _width,
    height: _height,
    startX: _x
   };
}

function moveUfos(){
  for(var i=0; i<ufoArray.length; i++){
    image(ufo, ufoArray[i].x, ufoArray[i].y, ufoArray[i].width, ufoArray[i].height);
    angle = atan2(facePoint.y - ufoArray[i].y, facePoint.x - ufoArray[i].x);
    ufoArray[i].x += cos(angle) * ufoSpeed;
    ufoArray[i].y += sin(angle) * ufoSpeed;
    fill(0);
    ellipse(facePoint.x, facePoint.y, 50, 50);
  }
}


//Most of this function was from an AV computing class lesson, I modified it to suit my needs.
var Grid = function(_w, _h){
this.outFrame = 0;
this.noteWidth = 40;
this.worldWidth = _w;
this.worldHeight = _h;
this.numOfNotesX = int(this.worldWidth/this.noteWidth);
this.numOfNotesY = int(this.worldHeight/this.noteWidth);
this.arrayLength = this.numOfNotesX * this.numOfNotesY;
this.noteStates = [];
this.noteStates =  new Array(this.arrayLength).fill(0);
this.colorArray = [];
// console.log(this);
// console.log(_w, _h);

// set the original colors of the notes
for (var i=0;i<this.arrayLength;i++){
  this.colorArray.push(color(255,0,0,150));
}

this.update = function(_img){
  this.outFrame = _img;
  this.outFrame.loadPixels();
  for (var x = 0; x < this.outFrame.width; x += 1) {
      for (var y = 0; y < this.outFrame.height; y += 1) {
          var index = (x + (y * this.outFrame.width)) * 4;
          var state = outFrame.pixels[index + 0];
          if (state==255){
            var screenX = map(x, 0, this.outFrame.width, 0, this.worldWidth);
            var screenY = map(y, 0, this.outFrame.height, 0, this.worldHeight);
            var noteIndexX = int(screenX/this.noteWidth);
            var noteIndexY = int(screenY/this.noteWidth);
            var noteIndex = noteIndexX + noteIndexY*this.numOfNotesX;
            this.noteStates[noteIndex] = 1;
          }
      }
  }

  //this is what "ages" the notes so that as time goes by things can change.
  for (var i=0; i<this.arrayLength;i++){
    this.noteStates[i]-= 0.05;
    this.noteStates[i]=constrain(this.noteStates[i],0,1);
  }

  this.draw();
};

// this is where each note is drawn
// use can use the noteStates variable to affect the notes as time goes by
// after that region has been activated
this.draw = function(){
  push();
  noStroke();
  for (var x=0; x<this.numOfNotesX; x++){
    for (var y=0; y<this.numOfNotesY; y++){
            var posX = this.noteWidth/2 + x*this.noteWidth;
            var posY = this.noteWidth/2 + y*this.noteWidth;
            var noteIndex = x + (y * this.numOfNotesX);
            if (this.noteStates[noteIndex]>0) {
              //console.log("CALLED");
              for (var i=0; i<ufoArray.length; i++){
                // console.log("posY: " +(posY + this.noteWidth/2) + " ufoY: " + ufoArray[i].y);
                if(posX + this.noteWidth/2 > ufoArray[i].x &&
                   posX - this.noteWidth/2 < ufoArray[i].x + ufoArray[i].width &&
                   posY + this.noteWidth/2 > ufoArray[i].y &&
                   posY - this.noteWidth/2 < ufoArray[i].y + ufoArray[i].height)
                {
                  //console.log("SOUP");
                  //ufoArray.splice(i, 1);
                  if(frameCount - oldFrameCount>10){
                    score += 1;
                  }
                  sizeRange = ufoSize * random(0.8, 1.5);
                  ufoArray[i].x = random(0,canvas.width);
                  ufoArray[i].y = random(0, canvas.height - 30);
                  ufoArray[i].startX = ufoArray[i].x;
                  ufoArray[i].width = sizeRange*1.34;
                  ufoArray[i].height = sizeRange;
                }
              }
            }
      }
  }
  pop();
}
};
