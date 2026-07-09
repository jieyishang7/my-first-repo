var sketch1 = function(p) {
  var canvas;
  var parentEl;

  p.setup = function() {
    parentEl = document.getElementById('canvas-container-1');
    var w = Math.max(640, parentEl.clientWidth || 800);
    var h = Math.floor(w * 0.56);
    canvas = p.createCanvas(w, h);
    canvas.parent('canvas-container-1');
    p.noLoop();
  };

  p.windowResized = function() {
    if (!parentEl) return;
    var w = Math.max(640, parentEl.clientWidth || 800);
    var h = Math.floor(w * 0.56);
    p.resizeCanvas(w, h);
    p.redraw();
  };

  p.draw = function() {
    p.background(240, 235, 220);
    p.noStroke();

    p.push();
    p.rectMode(p.CENTER);
    p.translate(180, 220);
    p.rotate(-0.18);
    p.fill(255, 215, 0, 200);
    p.rect(0, 0, 360, 180);
    p.pop();

    p.push();
    p.fill(0, 80, 150, 200);
    p.translate(360, 140);
    p.rotate(0.08);
    p.ellipse(0, 0, 240, 240);
    p.pop();

    p.push();
    p.fill(210, 50, 45, 200);
    p.translate(260, 260);
    p.rotate(0.06);
    p.triangle(-100, 80, 100, 80, 0, -140);
    p.pop();

    p.push();
    p.fill(140, 80, 40, 200);
    p.translate(520, 260);
    p.rotate(-0.12);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 80, 120);
    p.pop();
  };
};

var myp5_1 = new p5(sketch1, 'canvas-container-1');
