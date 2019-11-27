let users;

let time;
let hour, min, sec;
let s_hour, s_min, s_sec;
let year=2019, month=8, day=1;
let s_year, s_month, s_day;

let map;

let maxLati=36.0304, minLati=36.0045;
let minLongi=129.3012, maxLongi=129.3527;
let default_url = 'https://dilab2019.github.io/DIforDemonstration-GPSbasedHeatmap/';



let max_temp = 40;
let min_temp = 0;

var rawData;
function preload() {
  map = loadImage(default_url+'data/pohang.png');
  rawData = loadStrings(default_url+'data/8_user.txt');
}





function setup() {
  createCanvas(windowWidth, windowHeight);
  users = new UserData(rawData);
}



function mapping(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

function time_setting(){
  if (sec<10) s="0"+sec;
  else s_sec=""+sec;

  if (min<10) m="0"+min;
  else s_min=""+min;

  if (hour<10) h="0"+hour;
  else s_hour=""+hour;

  if (month<10) _month="0"+month;
  else s_month=""+month;

  if (day<10) _day="0"+day;
  else s_day=""+day;
}

function time_increasement(){
  sec++;

  if (sec==60) {
    sec=0;
    min++;
    if (min==60)
    {
      min=0;
      hour++;
      if (hour==24) {
        hour=0;
        day++;
       }
     }
   }
}



//gloval index is gonna prove every contents in #_user.txt file
var gloval_index=0;
function draw() {
  resizeCanvas(windowWidth, windowHeight);
  //background(0);
  translate(windowWidth/2, windowHeight/2);

  smooth();

  time_setting();

  time = s_year+"-"+s_month+"-"+s_day+" "+s_hour+":"+s_min+":"+s_sec;

  for(;users.data[gloval_index][0]!="" && String(users.data[gloval_index][0]).includes(time);gloval_index++)
  {
    let tempLati = trim(users[gloval_index].data[l][3]);
    print("tempLati "+tempLati+"\n");
    let tempLong = trim(users[gloval_index].data[l][4]);
    print("tempLong "+tempLong+"\n");

    let newLatitude = mapping(tempLati, maxLati, minLati, 0, windowHeight);
    let newLongitude = mapping(tempLong, minLongi, maxLongi, 0, windowWidth);
    print("newLatitude "+newLatitude+"    "+"newLongitude "+newLongitude+"\n\n");

    let temperature = mapping(trim(users[i].data[gloval_index][5]), min_temp, max_temp, 0, 255);

    noStroke();
    colorMode(HSB);
    fill(temperature,255,255,50);
    ellipse(newLatitude,newLongitude,40,40);
  }

  time_increasement();
  temperature_legend();




  if(day==32) noLoop();
}


function temperature_legend(){
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

  colorMode(HSB);
  for(var i=0;i<255;i++){
    stroke(i,255,255,0.5);
    line(-windowWidth/2+100,-127+i,-windowWidth/2+200,-127+i);
  }
}


class UserData {


    constructor(rawData) {


    var data_length = 7
    this.fileLength = rawData.length; //1+data_number*7+1

    //  make two dimensional array
    this.data = [];
    for(var l=0;l<this.fileLength/data_length;l++) this.data[l]=[];
    // this.data = new Array(parseInt(this.fileLength/data_length));
    //  make second entry
    // for (i=0; i<this.data.length; i++)
    //   this.data[i]=new Array(data_length);
    var i, recover=0, missNum;
    var  pieces1=[], pieces2=[], pieces3=[], pieces4=[], pieces5=[] , pieces6=[];

    for(i=0 ; i<rawData.length ; i++) print(rawData[i]);

    for (i = 0; i < parseInt(rawData.length/data_length); i++) {
      missNum=0;
      if (rawData[data_length*i+(recover%data_length)+2].includes("dust") && rawData[data_length*i+(recover%data_length)+3].includes("humidity") && rawData[data_length*i+(recover%data_length)+4].includes("latitude") && rawData[data_length*i+(recover%data_length)+5].includes("longitude") && rawData[data_length*i+(recover%data_length)+6].includes("temperature"))
      {
        pieces1 = split(rawData[data_length*i+(recover%data_length)+1], "{");
        pieces2 = split(rawData[data_length*i+(recover%data_length)+2], " : ");
        pieces3 = split(rawData[data_length*i+(recover%data_length)+3], " : ");
        pieces4 = split(rawData[data_length*i+(recover%data_length)+4], " : ");
        pieces5 = split(rawData[data_length*i+(recover%data_length)+5], " : ");
        pieces6 = split(rawData[data_length*i+(recover%data_length)+6], " : ");


        this.data[i][0] = pieces1[0];//data
        this.data[i][1] = pieces2[1];//dust
        this.data[i][2] = pieces3[1];//humidity
        this.data[i][3] = pieces4[1];//latitude
        this.data[i][4] = pieces5[1];//longitude
        this.data[i][5] = pieces6[1];//temperature


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
