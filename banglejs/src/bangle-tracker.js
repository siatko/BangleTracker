/* jshint esversion: 6 */
/*
 * BangleTracker - WatchApp
 */

// Screen
const screen = {
  width: g.getWidth(),
  height: g.getHeight(),
  hcenter: g.getWidth() / 2,
  vtop: g.getHeight() / 3.75,
  vbottom: g.getHeight() / 1.25,
  vcenter: g.getHeight() / 2,
};

// Font
//console.log(g.getFonts());
require("Font7x11Numeric7Seg").add(Graphics);

function drawTimer() {
  // Position
  var posX = screen.hcenter + 55, posY = screen.vtop + 20;
  // Timer
  var hour = '00';
  var minute = '00';
  var second = '00';
  var time = (" " + hour).substr(-2) + ":" + ("0" + minute).substr(-2) + ":" + ("0" + second).substr(-2);
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(time, posX, posY, true);

}

function drawClock() {
  // Position
  var posX = screen.hcenter + 57, posY = screen.vtop + 90;
  // Time
  let d = Date();
  var time = (" 0" + d.getHours()).substr(-2) + ":" + ("0" + d.getMinutes()).substr(-2);
  g.reset();
  g.setFont("7x11Numeric7Seg", 4);
  g.setFontAlign(1, 1);
  g.setColor(1, 0.65, 1);
  g.drawString(time, posX, posY, true);
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 0.65, 1);
  g.drawString(("0" + d.getSeconds()).substr(-2), posX +30, posY, true);

}

function drawDate() {
  // Position
  var posX = screen.hcenter + 57, posY = screen.vtop + 120;
  // Time
  let d = Date();
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  var time = ("0" + day).substr(-2) + "." + ("0" + month).substr(-2) + "." + year;
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(time, posX, posY, true);
}

function drawBpm(bpmValue) {
  var posX = 70, posY = screen.vbottom + 27;
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(bpmValue, posX, posY, true);
}

function drawSteps(stepValue) {
  var posX =  220, posY = screen.vbottom + 27;
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(stepValue, posX, posY, true);
}

function drawHrmStatus(connected) {
  if (connected) {
    g.setColor(0, 1, 0);
  } else {
    g.setColor(1, 0, 0);
  }
  g.fillCircle(screen.hcenter - 85, screen.vcenter + 30, 7);
}

function getAvg(values) {
  const total = values.reduce((a, b) => a + b, 0);
  return total / values.length;
}

// Sensors

// Draw
g.clear();
drawTimer();
drawClock();
drawDate();

hrtArr = [];
Bangle.on('HRM', function(hrm) {
  if(hrm.confidence > 49 && hrm.bpm != 200) {
    hrtArr.push(hrm.bpm);
    wasMeasured = hrm.bpm;
  }
  if(hrtArr.length > 5) {
    drawBpm('     ');
    drawBpm(parseInt(getAvg(hrtArr)));
    NRF.updateServices({
      0x180D: { // heart_rate
        0x2A37: { // heart_rate_measurement
          notify: true,
          value : [0x06, parseInt(getAvg(hrtArr))],
        }
      }
    });
    hrtArr.shift();
  }
  // Debug
  console.log("%: " + hrm.confidence);
  console.log("b: " + hrm.bpm);
  console.log(hrtArr);
  console.log("=========================")
});

setInterval(drawTimer, 1000);

// First Draw Bpm and Steps
drawBpm('     ');
drawSteps('     ');
drawHrmStatus(false);


Bangle.on('step', function (steps){
  drawSteps(steps);
})

// Services
NRF.setServices({
  0x180D: { // heart_rate
    0x2A37: { // heart_rate_measurement
      notify: true,
      value : [0x06, 0],
    }
  }
}, { advertise: [ '180D' ] });

var started = false;
setWatch(function() { // Reset
  if(!started) {
    Bangle.setHRMPower(1);
    started = true;
    drawHrmStatus(true);
  }  else {
    Bangle.setHRMPower(0);
    started = false;
    drawHrmStatus(false);
    drawBpm('000')
  }
}, BTN2, {repeat:true});

Bangle.loadWidgets();
Bangle.drawWidgets();
setInterval(drawClock, 1000);
