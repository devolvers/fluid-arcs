import document from "document";
import clock from "clock";
import userActivity from "user-activity";
import { display } from "display";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import * as heartMonitor from "../common/hrm";
import * as util from "../common/utils";

// Set up all necessary variables
let clockHours    = document.getElementById("clockHours");
let clockMinutes  = document.getElementById("clockMinutes");
let clockSeconds  = document.getElementById("clockSeconds");
let date          = document.getElementById("date");
let batteryLevel  = document.getElementById("batteryLevel");

clock.granularity = "seconds";

let currentDay    = "";
let monthArray    = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep", "Oct", "Nov", "Dec" ];
let dataTypes     = [ "calories", "activeMinutes", "steps" ];
let dataProgress  = [];

for(var i=0; i < dataTypes.length; i++) {
  var currentData = dataTypes[i];
  dataProgress.push(util.getArcContainer(currentData));
}

// Refresh data, all other logic is in separate files
function refreshData(type) {
  let currentType = type.dataType;
  
  let currentDataProg = (userActivity.today.adjusted[currentType] || 0);
  let currentDataGoal = userActivity.goals[currentType];
  
  let currentDataArc = (currentDataProg / currentDataGoal) * 360;
  
  if (currentDataArc > 360) {
    currentDataArc = 360;
  }
  
  type.arcFront.sweepAngle = currentDataArc;
  type.dataCount.text = currentDataProg;
}

function refreshAllData() {
  for(var i=0; i<dataTypes.length; i++) {
    refreshData(dataProgress[i]);
  }
}

clock.ontick = evt => {
  let today = evt.date;
  let hours = today.getHours();
  
  if (preferences.clockDisplay === "12h") {
    hours = util.zeroPad(hours % 12 || 12);
  } else {
    hours = util.zeroPad(hours);
  }
  
  let mins          = util.zeroPad(today.getMinutes());
  let seconds       = util.zeroPad(today.getSeconds());
  
  clockHours.text   = hours;
  clockMinutes.text = mins;
  clockSeconds.text = seconds;
  
  let year = today.getFullYear();
  let monthNum = today.getMonth();
  let month    = monthArray[monthNum];
  let day      = today.getDate();
  
  date.text = month + ' ' + day;
  
  currentDay = year + "-" + util.zeroPad(monthNum+1) + "-" + day;
  
  batteryLevel.text = battery.chargeLevel + "%";
  
  refreshAllData();
}

heartMonitor.initialize();