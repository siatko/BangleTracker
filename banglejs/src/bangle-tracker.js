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
  var posX = screen.hcenter + 107, posY = screen.vtop + 10;
  // Time
  var hour = '00';
  var minute = '00';
  var second = '00';
  var time = (" " + hour).substr(-2) + ":" + ("0" + minute).substr(-2) + ":" + ("0" + second).substr(-2);
  g.reset();
  g.setFont("7x11Numeric7Seg", 4);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(time, posX, posY, true);

}

function drawBpm(bpmValue) {
  var posX = screen.hcenter + 25, posY = screen.vcenter + 10;
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(bpmValue, posX, posY, true);
}

function drawSteps(stepValue) {
  var posX = screen.hcenter + 35, posY = screen.vbottom - 10;
  g.reset();
  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(1, 1);
  g.setColor(1, 1, 1);
  g.drawString(stepValue, posX, posY, true);
}

function drawGpsStatus(connected) {
  if (connected) {
    g.setColor(0, 1, 0);
  } else {
    g.setColor(1, 0, 0);
  }
  g.fillCircle(screen.hcenter, screen.vbottom + 15, 10);
}

function drawLines() {
  g.setColor(0, 0, 1);
  g.drawLine(0, 90, g.getWidth(), 90);
  g.drawLine(0, 145, g.getWidth(), 145);
}

function getAvg(values) {
  const total = values.reduce((a, b) => a + b, 0);
  return total / values.length;
}

// Sensors
Bangle.setHRMPower(1);

// Draw
g.clear();
drawTimer();

hrtArr = [];
Bangle.on('HRM', function(hrm) {
  if(hrm.confidence > 49 && hrm.bpm != 200) {
    hrtArr.push(hrm.bpm);
    wasMeasured = hrm.bpm;
  }
  if(hrtArr.length > 5) {
    drawBpm('000');
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
drawBpm('000');
drawSteps('00000');

drawGpsStatus(true);
drawLines();


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

// Intervals
