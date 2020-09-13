/* jshint esversion: 6 */
/*
 * BangleTracker - WatchApp
 */

// Screen
const screen = {
    width:  g.getWidth(),
    height: g.getHeight(),
    hcenter: g.getWidth() / 2,
    vtop:    g.getHeight() / 3.75,
    vbottom: g.getHeight() / 1.25,
    vcenter: g.getHeight() /2,
};

// Font
//console.log(g.getFonts());
require("Font7x11Numeric7Seg").add(Graphics);

function drawTime() {
    // Position
    var X = screen.hcenter + 107, Y = screen.vtop + 10;
    // Time
    var hour = '00';
    var minute = '00';
    var second = '00';
    var time = (" "+hour).substr(-2) + ":" + ("0"+minute).substr(-2) + ":" + ("0"+second).substr(-2);
    g.reset();
    g.setFont("7x11Numeric7Seg", 4);
    g.setFontAlign(1,1);
    g.setColor(1, 1, 1);
    g.drawString(time, X, Y, true);

}

function drawBpm(bpmValue) {
    var X = screen.hcenter +25, Y = screen.vcenter + 10;
    g.reset();
    g.setFont("7x11Numeric7Seg", 2);
    g.setFontAlign(1, 1);
    g.setColor(1, 1, 1);
    g.drawString(bpmValue, X, Y, true);
}

function drawSteps(stepValue) {
    var X = screen.hcenter +35, Y = screen.vbottom - 10;
    g.reset();
    g.setFont("7x11Numeric7Seg", 2);
    g.setFontAlign(1, 1);
    g.setColor(1, 1, 1);
    g.drawString(stepValue, X, Y, true);
}

function drawGpsStatus(connected) {
  if(connected) {
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

// Draw
g.clear();
drawTime();
drawBpm('000');
drawSteps('00000');
drawGpsStatus(true);
drawLines();
var secondInterval = setInterval(drawTime, 1000);
