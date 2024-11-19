let webcam;
let detector;

let videoFrame;

let state = 0;


let btn_pause = [];
let btn_record = [];
let btn_stop = [];
let icon_person;
let stateIndicator = [];

let recordingTime = '00:00:00';
let recordingStartTime = 0; 
let pausedStartTime = 0; 
let pausedTime = 0; 
let totalPausedTime = 0; 

let peopleNumber = 0;

let detectedObjects = [];

let myWriter;
let writerMsg='';

function preload() {  
  detector = ml5.objectDetector('cocossd');
  
  videoFrame = loadImage('img/video_preview.png');
  
  btn_pause[0] = loadImage('img/pause_disabled.png');
  btn_pause[1] = loadImage('img/pause_activated.png');
  
  btn_record[0] = loadImage('img/record_stop.png');
  btn_record[1] = loadImage('img/record_recording.png');
  btn_record[2] = loadImage('img/record_paused.png');
  btn_record[3] = loadImage('img/record_saved.png');
  
  btn_stop[0] = loadImage('img/stop_disabled.png');
  btn_stop[1] = loadImage('img/stop_activated.png');
  
  icon_person = loadImage('img/icon_person.png');
  
  stateIndicator[0] = loadImage('img/tapToRecord.png');
  stateIndicator[1] = loadImage('img/state_recording.png');
  stateIndicator[2] = loadImage('img/state_paused.png');
  stateIndicator[3] = loadImage('img/state_saved.png');
}

function setup() {
  createCanvas(1920,1080);
  webcam = createCapture(VIDEO);
  webcam.size(1400,1080);
  webcam.hide();
  
  detector.detect(webcam, gotDetections);
}

function draw() {
  background(0);
  
  calculateRecordingTime();
  
  drawVideoPreview(0,0,1400,1080);
  
  doCOCOSSD();
  
  drawButtons(state);
  drawStatusBar(state);
  drawCounter(state);
  drawStateIndicator(state);
  
  drawStateStatusmenu(state);
  
  writeLog(state);
  
  peopleNumber = 0;
}

function drawVideoPreview(x, y, w, h){
  image(webcam, x, y, w, h);
  image(videoFrame, x, y, w, h);
}

function drawStateIndicator(currentState){
  image(stateIndicator[currentState], 1600,900,120,24);
}

function drawButtons(currentState){
  let pause_stop_button_number = 0;
  if(currentState == 1){
    pause_stop_button_number = 1;
  }  
  image(btn_pause[pause_stop_button_number], 1470, 950, 80, 80);
  image(btn_record[currentState], 1620, 950, 80, 80);
  image(btn_stop[pause_stop_button_number], 1770,950, 80, 80);
}

function drawCounter(currentState){
  fill(255, 51);
  noStroke();
  rect(1470,900,60,20,4);
  
  textFont('Inter');
  textSize(20);
  
  if(currentState == 1){
    fill(255);
    textAlign(LEFT);
    text(peopleNumber, 1497, 915);
    image(icon_person, 1475,902,16,16);
  }else{
    fill(255,153);
    textAlign(LEFT);
    text(peopleNumber, 1497, 915);
    tint(255,153);
    image(icon_person, 1475,902,16,16);
    tint(255);
  }
}

function drawStatusBar(currentState){
  fill(255, 51);
  noStroke();
  rect(22,15,140,30,2);
  rect(168,15,102,30,2);
  rect(282,15,126,30,2);
  
  textFont('Inter');
  textSize(20);
  fill(0);
  
  let currentTime = ''+nf(hour(),2,0)+':'+nf(minute(),2,0)+':'+nf(second(),2,0);
  let currentDate = ''+year()+'.'+nf(month(),2,0)+'.'+nf(day(),2,0)+'.';
  
  if(currentState == 0){
    noFill();
    stroke(125);
    //stroke(255,255);
    strokeWeight(2);
    ellipse(38,30,11,11);
    //fill(255,153);
    fill(125); //Gray
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 60, 35);
    fill(125); //Gray
    textAlign(CENTER);
    text(currentTime, 220, 35);
    fill(125); //Gray
    textAlign(LEFT);
    text(currentDate,295,35);
    fill(125); //Gray
  }else if(currentState == 1){
    fill(202,38,38);
    noStroke();
    ellipse(38,30,12,12);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 60, 35);
    fill(125); //Gray
    textAlign(CENTER);
    text(currentTime, 220, 35);
    fill(125); //Gray
    textAlign(LEFT);
    text(currentDate, 295, 35);
    fill(125); //Gray
  }else if(currentState == 2){
    noFill();
    stroke(202,38,38);
    strokeWeight(2);
    ellipse(38,30,11,11);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 60, 35);
    fill(125); //Gray
    textAlign(CENTER);
    text(currentTime, 220, 35);
    fill(125); //Gray
    textAlign(LEFT);
    text(currentDate,295, 35);
    fill(125); //Gray
  }else if(currentState == 3){
    noFill();
    stroke(125);
    //stroke(255,153);
    strokeWeight(2);
    ellipse(38,30,11,11);
    fill(125); //Gray
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 60, 35);
    fill(125); //Gray
    textAlign(CENTER);
    text(currentTime, 220, 35);
    fill(125); //Gray
    textAlign(LEFT);
    text(currentDate,295, 35);
    fill(125); //Gray
  }
}



function drawStateStatusmenu(currentState){

  textFont('Inter');
  textSize(20);

  let currentTime = ''+nf(hour(),2,0)+':'+nf(minute(),2,0)+':'+nf(second(),2,0);
  let currentDate = ''+year()+'.'+nf(month(),2,0)+'.'+nf(day(),2,0)+'.';
  
  if(currentState == 0){
    text("Recording Time : " + recordingTime, 1420, 35);
    text("Current Time : " + currentTime, 1420, 70);
    text("Current Date : " + currentDate,1420,105);
  }else if(currentState == 1){

    text("Recording Time : " + recordingTime, 1420, 35);
    text("Current Time : " + currentTime, 1420, 70);
    text("Current Date : " +currentDate, 1420, 105);
  }else if(currentState == 2){
    text("Recording Time : " + recordingTime, 1420, 35);
    text("Current Time : " + currentTime, 1420, 70);
    text("Current Date : " +currentDate,1420, 105);
  }else if(currentState == 3){
    text("Recording Time : " + recordingTime, 1420, 35);
    text("Current time : " +currentTime, 1420, 70);
    text("Current Date : " +currentDate,1420, 105);
  }
}






function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  detectedObjects = results;
  detector.detect(webcam, gotDetections);
}

function mouseReleased(){
  if(state == 0){
    if(dist(mouseX, mouseY, 1650, 990) <= 40){
      state = 1; 
      recordingStartTime = millis();
      startLog();
    }
  }else if(state == 1){
    if(dist(mouseX, mouseY, 1500, 990) <= 40){ 
      state = 2; 
      pausedStartTime = millis();
    }
    if(dist(mouseX, mouseY, 1800, 990) <= 30){ 
      state = 3; 
      initializeTimes();
      saveLog();
    }
  }else if(state == 2){
    if(dist(mouseX, mouseY, 1650, 990) <= 30){
      state = 1; 
      totalPausedTime = totalPausedTime + pausedTime;
    }
  }else if(state == 3){
    if(dist(mouseX, mouseY, 1650, 990) <= 40){ 
      state = 0; 
    }
  }
}
function initializeTimes(){
  recordingStartTime = 0;
  pausedStartTime = 0;
  pausedTime = 0;
  totalPausedTime = 0;
}
function calculateRecordingTime(){
  let cur_time = millis();
  
  if(state == 0){ 
    recordingTime = '00:00:00';
  }else if(state == 1){ 
    let rec_time = cur_time - recordingStartTime - totalPausedTime;
    let rec_sec = int(rec_time / 1000) % 60;
    let rec_min = int(rec_time / (1000*60)) % 60;
    let rec_hour = int(rec_time / (1000*60*60)) % 60;
    
    recordingTime = ''+nf(rec_hour,2,0)+':'+nf(rec_min,2,0)+':'+nf(rec_sec,2,0);
  }else if(state == 2){ 
    pausedTime = millis() - pausedStartTime;
  }else if(state == 3){ 
    recordingTime = '00:00:00';
  }
}

function doCOCOSSD(){
  let tempMsg='';
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    
    if(object.label == 'person'){
      peopleNumber = peopleNumber + 1;
      
      stroke(255,0,254);
      strokeWeight(2);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(255,0,254);
      textSize(10);
      text(object.label+' '+peopleNumber, object.x, object.y - 5);
      
      let centerX = object.x + (object.width/2);
      let centerY = object.y + (object.height/2);
      strokeWeight(4);
      stroke(255,0,254);
      point(centerX, centerY);
      
      tempMsg = tempMsg+','+peopleNumber+','+centerX+','+centerY;
 
    }
  }
  let millisTime = int(millis() - recordingStartTime - totalPausedTime);
  writerMsg = ''+recordingTime+','+millisTime+','+peopleNumber+''+tempMsg;

}

function startLog(){
  let mm = nf(month(),2,0);
  let dd = nf(day(),2,0);
  let ho = nf(hour(),2,0);
  let mi = nf(minute(),2,0);
  let se = nf(second(),2,0);
  
  let fileName = 'data_'+ mm + dd +'_'+ ho + mi + se+'.csv';
  
  myWriter = createWriter(fileName);
}
function saveLog(){
  myWriter.close();
  myWriter.clear();
}
function writeLog(currentState){
  if(currentState == 1){
    myWriter.print(writerMsg);
  }
}