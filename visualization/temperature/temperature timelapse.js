var users;

var userNum;
var map1, postechMap1, transparentMap1;

var maxLati=36.0304, minLati=36.0045;
var minLongi=129.3012, maxLongi=129.3527;
var default_url = 'https://dilab2019.github.io/DIforDemonstration-GPSbasedHeatmap/';

var max_temp = 40;
var min_temp = 0;

var over = false;
var locked = false;
var xoff, fundo, posX;

//rawdata는 각 월에 맞춘 데이터 텍스트 정보
var rawData0, rawData1, rawData2, rawData3;

var saved_information;

function preload() {
  map1 = loadImage(default_url+'data/pohang.png');
//  keymap = rect(0,0,40,200);
  rawData0 = loadStrings(default_url+'data/'+8+'_tluser.txt');
  rawData1 = loadStrings(default_url+'data/'+9+'_tluser.txt');
  rawData2 = loadStrings(default_url+'data/'+10+'_tluser.txt');
  rawData3 = loadStrings(default_url+'data/'+11+'_tluser.txt');
  print("done preload.");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  posX=windowWidth/2-300;

  userNum=4;
  users = new Array(userNum);
  var userFileName;
  users[0] = new UserData(rawData0);
  users[1] = new UserData(rawData1);
  users[2] = new UserData(rawData2);
  users[3] = new UserData(rawData3);


  saved_information = new Array(5000);
  for (i=0; i<saved_information.length; i++)
    saved_information[i]=new Array(5);
//  print(map);
//  image(map, 0, 0,windowWidth, windowHeight);
  //draw keymap
    print("done setup.");
}

function mapping(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  //background(0);
  translate(windowWidth/2, windowHeight/2);
  smooth();
  print("canvas sized.");
////////////////////////////////////////////////////////////////////////////
  colorMode(RGB);
  imageMode(CENTER);
  image(map1, 0, 0, windowWidth, windowHeight);
  fill(255);
  textSize(25);
  //text(time, windowWidth/2-350, windowHeight/2-70, 10);
  //print(time);

  text("Temperature Guide", -windowWidth/2+55, 180);
  text("0°C ", -windowWidth/2+220, 128);
  text("40°C ", -windowWidth/2+220, -110);
  //text("0°C ", 220-width/2+move_x, 550-height/2+move_y, 10);
  //strokeWeight(8);
  //strokeCap(SQUARE);
  colorMode(HSB);
    for(var i=0;i<255;i++){
      stroke(i,255,255,0.5);
      line(-windowWidth/2+100,-127+i,-windowWidth/2+200,-127+i);
    }
    //custom slider
    translate(-windowWidth/2,-windowHeight/2);
    strokeWeight(3);
    stroke(0);
    line(windowWidth/2-300,windowHeight-100,windowWidth/2+300,windowHeight-100);
    fundo = posX;
    let x1 = mouseX;
    let y1 = mouseY;
    //line(0,0,x1,y1);
    let distance = dist(x1,y1,posX,windowHeight-100);
      if( distance <25){
        fill(50);
        over = true;
      }
      else{
        fill(0,0,100);
        over = false;
      }
    circle(posX, windowHeight-100, 50);
    if(posX<windowWidth/2-300){
      posX = windowWidth/2-300;
    }
    if(posX>windowWidth/2+300){
      posX = windowWidth/2+300;
    }

var monthForScore;
let dateValue= mapping(posX,windowWidth/2-300,windowWidth/2+300,0,121)
//0=20190801 1=20190802 30=20190831 / 31=20190901 60=20190930 / 61=20191001 91=20191031
let finalValue= int(dateValue);
let valueScoring;
if (finalValue<31){
  valueScoring = 20190801 + finalValue;
  monthForScore = 0;
}
else if (finalValue<61){
  valueScoring = 20190901 + (finalValue-31);
  monthForScore = 1;
}
else if (finalValue<92){
  valueScoring = 20191001 + (finalValue-61);
  monthForScore = 2;
}
else if (finalValue<122){
  valueScoring = 20191101 + (finalValue-92);
  monthForScore = 3;
}
print("final value is " + finalValue);
print("the date is " +valueScoring);
//score comparing
var mfsSelected = new Array();

  for (var i=0; i< ((users[monthForScore].data.length)/7); i++){
    if (users[monthForScore].data[i][9] == valueScoring){
      var tempLatitude =users[monthForScore].data[i][3];
      var tempLongitude =users[monthForScore].data[i][4];

      let newLatitude = mapping(tempLatitude, maxLati, minLati, 0,windowHeight);
      let newLongitude = mapping(tempLongitude, minLongi, maxLongi, 0, windowWidth);

      var temperature = users[monthForScore].data[i][5];
      var newTemperature = mapping(temperature, min_temp, max_temp, 0, 255);

      saved_information[i][0] = newLongitude-windowWidth/2;
      saved_information[i][1] = newLatitude-windowHeight/2;
        // saved_information[index][2] = picture_height;
      saved_information[i][3] = i;
      saved_information[i][4] = newTemperature;
      mfsSelected.push(i);
      print(i);
    }
  /*  else if(users[monthForScore].data[i][9] = (valueScoring+1)){
      print('broken');
      break;
    }*/
  }
  //visualization
noStroke();
colorMode(HSB);
if(typeof mfsSelected !== 'undefined' && mfsSelected.length> 0){
  for(var k=mfsSelected[0]; k< mfsSelected.length; k++){
    fill(saved_information[k][4],255,255,50);
    ellipse(saved_information[k][0], saved_information[k][1], 10,10);
    mfsSelected = [];
    ellipse(windowWidth/2,windowHeight/2,50,50);
    print(saved_information[k][0]);
    print("washed out");
  }

}
else if(typeof mfsSelected == 'undefined'&& mfsSelected.length == 0){
  print("the unknown");
}

}//void draw ends here/////////////////////////////////////////////////////////

function mousePressed(){
  if(over){
    locked=true;
    xoff = mouseX-posX;
  }
}
function mouseDragged(){
  if(locked){
    posX = mouseX-xoff;
  }
}
function mouseReleased(){
  locked=false;
}


class UserData {
    constructor(rawData) {

    var data_length = 7 // 1시간, 2dust, 3hu, 4la, 5lo, 6temp, 7}
    this.fileLength = rawData.length; //the whole length

//  make two dimensional array
    this.data = new Array(parseInt(this.fileLength/data_length));
    //date 구분
    this.dateTime = new Array(parseInt(this.fileLength/data_length));//2019-08-01 09:00:00
    this.dateOnly = new Array(parseInt(this.fileLength/data_length));//2019-08-01
    this.timeOnly = new Array(parseInt(this.fileLength/data_length));//09:00:00
    for (i=0; i<this.data.length; i++)
      this.data[i]=new Array(10);
      //this.dateTime[i]=new Array(3);//dTpieces
      //this.dateOnly[i]=new Array(3);//dOpieces
      //this.timeOnly[i]=new Array(3);//tOpiecess

    var i, recover=0, missNum;
    var pieces2, pieces3, pieces4, pieces5 , pieces6 , pieces7;
    //for dateTime
    var dTpieces0, dTpieces1, dTpieces2;
    //for dateOnly // 2019-08-01
    var dOpieces, dOpieces0, dOpieces1, dOpieces2;
    //for timeOnly // 21:41:54
    var tOpieces, tOpieces0, tOpieces1, tOpieces2;
    //for filtering
    var timeScoring;

    // for(var i=0 ; i<rawData.length ; i++) print(rawData[i]);
    for (i = 0; i < parseInt(rawData.length/data_length); i++) {
      missNum=0;
      if (rawData[data_length*i+(recover%data_length)+2].includes("dust") && rawData[data_length*i+(recover%data_length)+3].includes("humidity") && rawData[data_length*i+(recover%data_length)+4].includes("latitude") && rawData[data_length*i+(recover%data_length)+5].includes("longitude") && rawData[data_length*i+(recover%data_length)+6].includes("temperature"))
      {
        pieces2 = split(rawData[data_length*i+(recover%data_length)+1], "{");
        pieces3 = split(rawData[data_length*i+(recover%data_length)+2], " : ");
        pieces4 = split(rawData[data_length*i+(recover%data_length)+3], " : ");
        pieces5 = split(rawData[data_length*i+(recover%data_length)+4], " : ");
        pieces6 = split(rawData[data_length*i+(recover%data_length)+5], " : ");
        pieces7 = split(rawData[data_length*i+(recover%data_length)+6], " : ");
        dTpieces0 = pieces2[0].substr(1,11); //2019-08-01
        dTpieces1 = pieces2[0].substr(12,8); //09:00:00
        dOpieces = split(dTpieces1, "-");
        dOpieces0 = dOpieces[0]; //2019
        dOpieces1 = dOpieces[1]; //08
        dOpieces2 = dOpieces[2]; //01
        timeScoring = 10000*parseInt(dOpieces[0])+100*parseInt(dOpieces[1])+parseInt(dOpieces[2]); //20190801
        /*tOpieces = split(tOpieces, ":");
        tOpieces0 = tOpieces[0]; //09
        tOpieces1 = tOpieces[1]; //00
        tOpieces2 = tOpieces[2]; //00*/

        this.data[i][0] = pieces2[0];//date
        this.data[i][1] = pieces3[1];//dust
        this.data[i][2] = pieces5[1];//humidity
        this.data[i][3] = pieces4[1];//latitude
        this.data[i][4] = pieces6[1];//longitude
        this.data[i][5] = pieces7[1];//temperature
        this.data[i][6] = dOpieces0; //2019
        this.data[i][7] = dOpieces1; //08
        this.data[i][8] = dOpieces2; //01
        this.data[i][9] = timeScoring; //20190801
        print("the timeScoring is "+i+pieces2[0]);

      //  println("date : "+data[i][0] + "   dB :" + data[i][1] + "   latitude :" + data[i][2] +"   logitude :" + data[i][3]+"   temperature :" + data[i][4]);
      } else
      {
        if (!rawData[data_length*i+(recover%data_length)+2].includes("dust")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+3].includes("humidity")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+4].includes("latitude")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+5].includes("longitude")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+6].includes("temperature")) recover--;
      }
    }
  }

  get getLength(){
    return parseInt(this.fileLength/this.data_length);
  }

  get getData() {
    return this.data;
  }
}
