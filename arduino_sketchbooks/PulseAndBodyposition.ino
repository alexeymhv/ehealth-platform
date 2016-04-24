#include <PinChangeInt.h>
#include <eHealth.h>
#include <Wire.h>
#include <SparkFun_MMA8452Q.h> 
#include <stdlib.h>
#include<Math.h>

int cont = 0;

MMA8452Q accel;

void setup() {

  Serial.begin(115200);  
  eHealth.initPulsioximeter();
  PCintPort::attachInterrupt(6, readPulsioximeter, RISING);  
  accel.init();
}

void loop() {  
  printCalculatedAccels();
  Serial.print("|");
  printPulsometerData();
  Serial.print("\n");
  delay(10); //	wait for 10 milisecs.
}

void readPulsioximeter(){  

  cont ++;

  if (cont == 50) { //Get only of one 50 measures to reduce the latency
    eHealth.readPulsioximeter();  
    cont = 0;
  }
}

void printCalculatedAccels(){ 
  accel.read();
  Serial.print(accel.cx, 4);
  Serial.print("|");
  Serial.print(accel.cy, 4);
  Serial.print("|");
  Serial.print(accel.cz, 4);
}

void printPulsometerData(){
  String bpm = String(eHealth.getBPM());
  String spo = String(eHealth.getOxygenSaturation());
  String values = bpm + "|" + spo;
  Serial.print(values);
}





