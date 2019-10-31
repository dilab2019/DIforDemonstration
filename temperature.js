let users = new Array();
let time;
let hour, min, sec;
let h, m, s ;
let map, postechMap, transparentMap;

let maxLati=37.5629, minLati=37.5531;
let maxLongi=127.0541, minLongi=127.0318;

function preload() {
  img = loadImage('map702.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  hour=12, min=30, sec=0;
  h="", m="", s="";
  // users = new UserData[10];
  print(map);
  image(map, 0, 0);
}

function draw() {
  print(map);
  translate(width/2, height/2);

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
  print("HELLO\n\n");
  // print(time);
  print("\nHELLO\n\n");

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




  imageMode(CENTER);
  image(map, 0, 0, windowWidth, windowHeight);
}



class UserData {
  constructor(fileName) {
    var data_length = 7
    this.fileName = fileName;
    this.rawData = loadStrings(fileName);
    if(this.rawData.length==0) print("its zero\n");
    else print("its not zero\n");

    this.fileLength = this.rawData.length;
    this.data =new String[this.fileLength/data_length-1][data_length-1];
    var i, recover=0, missNum;
    this.pieces2, this.pieces3, this.pieces4, this.pieces5 , this.pieces6 , this.pieces7;

    // for(int i=0 ; i<this.rawData.length ; i++) println(rawData[i]);

    for (i = 0; i < this.rawData.length/data_length; i++) {
      missNum=0;
      if (rawData[data_length*i+(recover%data_length)+2].contains("dB") && rawData[data_length*i+(recover%data_length)+3].contains("key") && rawData[data_length*i+(recover%data_length)+4].contains("latitude") && rawData[data_length*i+(recover%data_length)+5].contains("longitude") && rawData[data_length*i+(recover%data_length)+6].contains("temperature"))
      {
        pieces2 = split(rawData[data_length*i+(recover%data_length)+1], "{");
        pieces3 = split(rawData[data_length*i+(recover%data_length)+2], " : ");
        pieces4 = split(rawData[data_length*i+(recover%data_length)+3], " : ");
        pieces5 = split(rawData[data_length*i+(recover%data_length)+4], " : ");
        pieces6 = split(rawData[data_length*i+(recover%data_length)+5], " : ");
        pieces7 = split(rawData[data_length*i+(recover%data_length)+6], " : ");

        data[i][0] = pieces2[0];//data
        data[i][1] = pieces3[1];//db
        data[i][2] = pieces4[1];// time+fileName of image
        data[i][3] = pieces5[1];//latitude
        data[i][4] = pieces6[1];//longitude
        data[i][5] = pieces7[1];//temperature

        //println("date : "+data[i][0] + "   dB :" + data[i][1] + "   latitude :" + data[i][2] +"   logitude :" + data[i][3]+"   temperature :" + data[i][4]);
      } else
      {
        if (!rawData[data_length*i+(recover%data_length)+2].contains("dB")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+3].contains("key")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+4].contains("latitude")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+5].contains("longitude")) recover--;
        if (!rawData[data_length*i+(recover%data_length)+6].contains("temperature")) recover--;
      }
    }
  }

  get getLength(){
    return this.fileLength/this.data_length;
  }

  get getData() {
    return this.data;
  }
}
