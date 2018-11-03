import { me } from "appbit";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import * as util from "utils";

let hrm, checkInterval;

export function initialize() {
  if (me.permissions.granted("access_heart_rate")) {
    hrm = new HeartRateSensor();
    heartRateSetup();
    startReading();
  } 
  else {
    console.log("Heart Rate Permission was denied.");
    heartData.dataCount.text = "N/A";
  }
}

function getReading() {
  let currentDataArc = (hrm.heartRate / 180) * 360;
  
  if (currentDataArc > 360) {
    currentDataArc = 360;
  }
  
  let hrContainer = util.getArcContainer("heartRate");
  
  hrContainer.arcFront.sweepAngle = currentDataArc;
  hrContainer.dataCount.text = hrm.heartRate;
}

function heartRateSetup() {
  display.addEventListener("change", function() {
    if (display.on) {
      startReading();
    } else {
      stopReading();
    }
  });
}

function startReading() {
  if (!checkInterval) {
    hrm.start();
    getReading();
    checkInterval = setInterval(getReading, 1000);
  }
}

function stopReading() {
  hrm.stop();
  clearInterval(checkInterval);
  checkInterval = null;
}