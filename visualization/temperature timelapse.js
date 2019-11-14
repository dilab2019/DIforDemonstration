let users;

let time;
let hour, min, sec;
let userNum=4;
let h, m, s ;
let year=2019, month=8, day=19;
let map, postechMap, transparentMap;

let maxLati=37.5629, minLati=37.5531;
let maxLongi=127.0541, minLongi=127.0318;
let default_url = 'https://dilab2019.github.io/DIforDemonstration-GPSbasedHeatmap/';


let max_temp = 40;
let min_temp = 0;

let over = false;
let locked = false;
var xoff, fundo, posX;

var parameter;



var rawData0, rawData1, rawData2, rawData3;
function preload() {
  map = loadImage(default_url+'data/map702.png');
//  keymap = rect(0,0,40,200);
  rawData0 = loadStrings(default_url+'data/user'+0+'.txt');
  rawData1 = loadStrings(default_url+'data/user'+1+'.txt');
  rawData2 = loadStrings(default_url+'data/user'+2+'.txt');
  rawData3 = loadStrings(default_url+'data/user'+3+'.txt');
}


var saved_information;




function setup() {
  createCanvas(windowWidth, windowHeight);

  posX=windowWidth/2-300;

  hour=12, min=30, sec=0;
  h="", m="", s="";

  userNum=4;
  users = new Array(userNum);
  var userFileName,i;
  users[0] = new UserData(rawData0);
  users[1] = new UserData(rawData1);
  users[2] = new UserData(rawData2);
  users[3] = new UserData(rawData3);

  saved_information = new Array(200);
  for (i=0; i<saved_information.length; i++)
    saved_information[i]=new Array(5);
//  print(map);
//  image(map, 0, 0,windowWidth, windowHeight);
  //draw keymap

}



var index=0;


function mapping(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};


function draw() {
  resizeCanvas(windowWidth, windowHeight);

  //background(0);
  translate(windowWidth/2, windowHeight/2);

  smooth();

  if (sec<10) s="0"+sec;
  else s=""+sec;

  if (min<10) m="0"+min;
  else m=""+min;

  if (hour<10) h="0"+hour;
  else h=""+hour;

  if (month<10) _month="0"+month;
  else _month=""+month;

  if (day<10) _day="0"+day;
  else _day=""+day;



  time = year+"-"+_month+"-"+_day+" "+h+":"+m+":"+s;
//  timeSpot[]= new Array(userNum);

  for (var i=0; i<userNum; i++)
  {
    for (var l=0; l<users[i].data.length; l++)
    {

      if (users[i].data[l][0]!="" && String(users[i].data[l][0]).includes(time))
      {
        //timeSpot[i] = 60*min + sec;
        //location
        var tempLatitude = split(users[i].data[l][3], ",");
        var tempLati = trim(tempLatitude[0]);
        var tempLongitude = split(users[i].data[l][4], ",");
        var tempLong = trim(tempLongitude[0]);
        print("tempLatitude "+tempLatitude+"\n");
        print("tempLati "+tempLati+"\n");
        print("tempLongitude "+tempLongitude+"\n");
        print("tempLong "+tempLong+"\n");


        let newLatitude = mapping(tempLati, maxLati, minLati, 0, windowHeight);
        let newLongitude = mapping(tempLong, minLongi, maxLongi, 0, windowWidth);
        print("newLatitude "+newLatitude+"    "+"newLongitude "+newLongitude+"\n\n");

        //temperature
        var temperature = users[i].data[l][5];
        var _temperature = mapping(temperature, min_temp, max_temp, 0, 255);

        //save information
        saved_information[index][0] = newLongitude-windowWidth/2;
        saved_information[index][1] = newLatitude-windowHeight/2;
        // saved_information[index][2] = picture_height;
        saved_information[index][3] = i;
        saved_information[index][4] = _temperature;

        fill(255, 0, 0);
        index++;
        print("index "+index);
        break;
      }
    }
  }
  print("index  "+index+"\n\n\n");
  //visualization
  noStroke();
   colorMode(HSB);
   for (var k=0; k<index; k++)
   {
     print("hello       "+saved_information[k][4]);
     fill(saved_information[k][4],255,255,50);
     ellipse(saved_information[k][0],saved_information[k][1],40,40);

   }



/*
  sec++;

 if (sec==60) {
   sec=0;
   min++;
   if (min==60)
   {
     min=0;
     hour++;
     if (hour==13) {
       hour=0;
       day++;
       if (day == 31)
       {
         day=0;
         month++;
        }
      }
    }
  }
*/

  colorMode(RGB);
  imageMode(CENTER);
  image(map, 0, 0, windowWidth, windowHeight);
  fill(255);
  textSize(25);
  text(time, windowWidth/2-350, windowHeight/2-70, 10);
  print(time);

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
      if( distance <50){
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
let minuteValue= mapping(posX,windowWidth/2-300,windowWidth/2+300,30,59)
let wholeValue= mapping(posX,windowWidth/2-300,windowWidth/2+300,0,3599)
let finalValue= int(wholeValue);
/*for(var i =1; i<60; i++;){
  if(60*(i-1)-1 < finalValue < 60*i){
    min = (i-1);
    sec = (finalValue - 60(i-1));
  }
}
*/
min = int(minuteValue);

}//void draw ends here

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

    var data_length = 7
    this.fileLength = rawData.length;

//  make two dimensional array
    this.data = new Array(parseInt(this.fileLength/data_length));
    for (i=0; i<this.data.length; i++)
      this.data[i]=new Array(data_length);

    var i, recover=0, missNum;
    var pieces2, pieces3, pieces4, pieces5 , pieces6 , pieces7;

    // for(var i=0 ; i<rawData.length ; i++) print(rawData[i]);

    for (i = 0; i < parseInt(rawData.length/data_length); i++) {
      missNum=0;
      if (rawData[data_length*i+(recover%data_length)+2].includes("dB") && rawData[data_length*i+(recover%data_length)+3].includes("key") && rawData[data_length*i+(recover%data_length)+4].includes("latitude") && rawData[data_length*i+(recover%data_length)+5].includes("longitude") && rawData[data_length*i+(recover%data_length)+6].includes("temperature"))
      {
        pieces2 = split(rawData[data_length*i+(recover%data_length)+1], "{");
        pieces3 = split(rawData[data_length*i+(recover%data_length)+2], " : ");
        pieces4 = split(rawData[data_length*i+(recover%data_length)+3], " : ");
        pieces5 = split(rawData[data_length*i+(recover%data_length)+4], " : ");
        pieces6 = split(rawData[data_length*i+(recover%data_length)+5], " : ");
        pieces7 = split(rawData[data_length*i+(recover%data_length)+6], " : ");

        this.data[i][0] = pieces2[0];//data
        this.data[i][1] = pieces3[1];//db
        this.data[i][3] = pieces5[1];//latitude
        this.data[i][2] = pieces4[1];// time+fileName of image
        this.data[i][4] = pieces6[1];//longitude
        this.data[i][5] = pieces7[1];//temperature

        //println("date : "+data[i][0] + "   dB :" + data[i][1] + "   latitude :" + data[i][2] +"   logitude :" + data[i][3]+"   temperature :" + data[i][4]);
      } else
      {
        if (!rawData[data_length*i+(recover%data_length)+2].includes("dB")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+3].includes("key")) recover--;
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