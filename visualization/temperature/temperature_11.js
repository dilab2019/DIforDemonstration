let users;

let time;
let hour=9, min=0, sec=0;
let s_hour, s_min, s_sec;
let year=2019, month=11, day=1;
let s_year="2019", s_month, s_day;

let map;

let maxLati=36.0304, minLati=36.0045;
let minLongi=129.3012, maxLongi=129.3527;
let default_url = 'https://dilab2019.github.io/DIforDemonstration-GPSbasedHeatmap/';



let max_temp = 40;
let min_temp = 0;

let rawData;
function preload() {
  map = loadImage(default_url+'data/pohang.png');
  rawData = loadStrings(default_url+'data/11_user.txt');
}


let drawing = [];
let max_draw_number=200;
function setup() {
  createCanvas(windowWidth, windowHeight);
  users = new UserData(rawData);

  for(let i=0;i<max_draw_number;i++) drawing[i]=[];

}



function mapping(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

function time_setting(){
  if (sec<10) s_sec="0"+sec;
  else s_sec=""+sec;

  if (min<10) s_min="0"+min;
  else s_min=""+min;

  if (hour<10) s_hour="0"+hour;
  else s_hour=""+hour;

  if (month<10) s_month="0"+month;
  else s_month=""+month;

  if (day<10) s_day="0"+day;
  else s_day=""+day;

  // time = s_year+"-"+s_month+"-"+s_day+" "+s_hour+":"+s_min+":"+s_sec;
  // print(time+"\n");
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
let gloval_index=0;
let drawing_index=0;
function draw() {
  resizeCanvas(windowWidth, windowHeight);


  translate(windowWidth/2, windowHeight/2);
  imageMode(CENTER);
  tint(255,128);
  image(map, 0, 0, windowWidth, windowHeight);

  smooth();

  time_setting();

  time = s_year+"-"+s_month+"-"+s_day+" "+s_hour+":"+s_min+":"+s_sec;
  // console.log(time+"\n");
  print(users.data[gloval_index][0]+"\t"+time+"\n");

  for(;users.data[gloval_index][0]!="" && String(users.data[gloval_index][0]).includes(time);gloval_index++)
  {

    let tempLati = trim(users.data[gloval_index][3]);
    print("tempLati "+tempLati+"\n");
    let tempLong = trim(users.data[gloval_index][4]);
    print("tempLong "+tempLong+"\n");

    let newLatitude = mapping(tempLati, maxLati, minLati, 0, windowHeight);
    let newLongitude = mapping(tempLong, minLongi, maxLongi, 0, windowWidth);
    // if(newLongitude<windowWidth/4)
    //   newLongitude+=windowWidth/2;
    // if(newLongitude>windowWidth/4 && newLongitude<windowWidth/8*3 && newLatitude>windowHeight/2){
    //   newLongitude+=windowWidth/8;
    //   newLatitude-=windowHeight/2;
    // }
    print("newLatitude "+newLatitude+"    "+"newLongitude "+newLongitude+"\n\n");

    let temperature = mapping(trim(users.data[gloval_index][5]), min_temp, max_temp, 0, 255);


    print(newLatitude+"   "+newLongitude+"\n");


    drawing_index++;
    drawing[drawing_index%max_draw_number][0]=newLongitude;
    drawing[drawing_index%max_draw_number][1]=newLatitude;
    drawing[drawing_index%max_draw_number][2]=temperature;
  }

  noStroke();
  colorMode(HSB);
  let loop=0;
  for(let i=drawing_index%max_draw_number; loop<max_draw_number && drawing[i][2]!=undefined ;i--){
    if(i==0) i=max_draw_number-1;

    fill(drawing[i][2],255,255,1-loop*0.005);
    // if(drawing[i][0]-windowWidth/2 < windowWidth/4){
    //   ellipse(drawing[i][0],drawing[i][1]-windowHeight/2,20,20);
    // }
    // else{
      ellipse(drawing[i][0]-windowWidth/4,drawing[i][1]-windowHeight/2,5,5);
    //   print("HELLO\n");
    // }

    loop++;
    if(loop==max_draw_number) break;
  }
  time_increasement();
  temperature_legend();




  if(day==32) noLoop();
}


function temperature_legend(){
  fill(255);
  textSize(25);
  text(time, windowWidth/2-350, windowHeight/2-70, 10);


  text("Temperature Guide", -windowWidth/2+55, 180);
  text("0°C ", -windowWidth/2+220, 128);
  text("40°C ", -windowWidth/2+220, -110);

  colorMode(HSB);
  for(let i=0;i<255;i+=10){
    stroke(i,255,255,0.5);
    strokeWeight(1);
    line(-windowWidth/2+100,-127+i,-windowWidth/2+200,-127+i);
  }
}


class UserData {


    constructor(rawData) {


    let data_length = 7
    this.fileLength = rawData.length; //1+data_number*7+1

    //  make two dimensional array
    this.data = [];
    for(let l=0;l<this.fileLength/data_length;l++) this.data[l]=[];
    // this.data = new Array(parseInt(this.fileLength/data_length));

    let i, recover=0, missNum;
    let  pieces1=[], pieces2=[], pieces3=[], pieces4=[], pieces5=[] , pieces6=[];

    // for(i=0 ; i<rawData.length ; i++) print(rawData[i]);

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

        // for (let l = 0; l < 6; i++) {
        //   print(this.data[i][l]+"\n");
        // }
        // print("\n");
        // print("\n");
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
