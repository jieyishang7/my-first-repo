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
    p.push();
    p.scale(p.width / 1000);
    drawSky();
    drawSun();
    drawPerspectiveGrid();
    drawCitySilhouette();
    drawCardDeck();
    drawHearts();
    drawHud();
    p.pop();
  };

  function drawSky() {
    p.noStroke();
    for (var y = 0; y < 560; y += 4) {
      var amount = y / 560;
      var skyColor = p.lerpColor(p.color(2, 5, 22), p.color(36, 5, 62), amount);
      p.fill(skyColor);
      p.rect(0, y, 1000, 4);
    }

    p.randomSeed(27);
    for (var i = 0; i < 120; i++) {
      var starX = p.random(22, 978);
      var starY = p.random(20, 278);
      var size = p.random(1, 3.4);
      p.fill(i % 4 === 0 ? p.color(255, 43, 214, 190) : p.color(155, 245, 255, 190));
      p.circle(starX, starY, size);
    }

    p.stroke(0, 229, 255, 23);
    p.strokeWeight(1);
    for (var scanY = 0; scanY < 560; scanY += 6) {
      p.line(0, scanY, 1000, scanY);
    }
  }

  function drawSun() {
    var ctx = p.drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(785, 148, 112, 0, Math.PI * 2);
    ctx.clip();
    ctx.shadowColor = '#ff2bd6';
    ctx.shadowBlur = 34;
    p.noStroke();
    for (var y = 36; y < 260; y += 7) {
      var amount = (y - 36) / 224;
      p.fill(p.lerpColor(p.color(255, 247, 0), p.color(255, 43, 214), amount));
      p.rect(670, y, 230, 7);
      if ((y - 36) % 21 === 0) {
        p.fill(4, 7, 30, 170);
        p.rect(670, y + 5, 230, 5);
      }
    }
    ctx.restore();
    p.noFill();
    p.stroke(255, 138, 0, 180);
    p.strokeWeight(2);
    p.circle(785, 148, 232);
  }

  function drawPerspectiveGrid() {
    var horizon = 292;
    p.strokeWeight(1);
    p.stroke(0, 229, 255, 105);
    for (var x = -280; x <= 1280; x += 80) {
      p.line(500, horizon, x, 560);
    }
    p.stroke(255, 43, 214, 105);
    for (var row = 0; row <= 13; row++) {
      var rowY = horizon + Math.pow(row / 13, 1.72) * (560 - horizon);
      p.line(0, rowY, 1000, rowY);
    }
    p.stroke(255, 43, 214, 175);
    p.line(0, horizon, 1000, horizon);
  }

  function drawCitySilhouette() {
    p.noStroke();
    p.fill(2, 6, 22, 245);
    var towers = [
      [0, 236, 62, 58], [58, 212, 48, 82], [103, 252, 76, 42], [174, 225, 54, 69],
      [224, 246, 86, 48], [302, 218, 55, 76], [350, 258, 92, 36], [432, 232, 67, 62],
      [493, 251, 88, 43], [574, 210, 46, 84], [615, 244, 82, 50], [691, 222, 58, 72],
      [744, 252, 72, 42], [810, 214, 50, 80], [855, 237, 72, 57], [922, 202, 78, 92]
    ];
    towers.forEach(function(tower, index) {
      p.rect(tower[0], tower[1], tower[2], tower[3]);
      p.fill(index % 3 === 0 ? p.color(255, 43, 214, 145) : p.color(0, 229, 255, 120));
      for (var wx = tower[0] + 9; wx < tower[0] + tower[2] - 5; wx += 14) {
        p.rect(wx, tower[1] + 11, 4, 3);
      }
      p.fill(2, 6, 22, 245);
    });
  }

  function glow(color, blur) {
    p.drawingContext.shadowColor = color;
    p.drawingContext.shadowBlur = blur;
  }

  function clearGlow() {
    p.drawingContext.shadowBlur = 0;
  }

  function drawPlayingCard(x, y, angle, rank, suit, accent, backColor) {
    p.push();
    p.translate(x, y);
    p.rotate(angle);
    glow(accent, 24);
    p.fill(backColor);
    p.stroke(accent);
    p.strokeWeight(3);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 156, 220, 12);
    clearGlow();

    p.noFill();
    p.stroke(246, 247, 255, 125);
    p.strokeWeight(1);
    p.rect(0, 0, 136, 200, 8);

    p.stroke(accent);
    p.line(-54, -72, 54, -72);
    p.line(-54, 72, 54, 72);
    for (var lineX = -46; lineX <= 46; lineX += 23) {
      p.line(lineX, -64, lineX, -57);
      p.line(lineX, 57, lineX, 64);
    }

    p.noStroke();
    p.fill(accent);
    p.textFont('Arial');
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(25);
    p.text(rank, -58, -94);
    p.textSize(20);
    p.text(suit, -58, -65);

    p.push();
    p.rotate(Math.PI);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(25);
    p.text(rank, -58, -94);
    p.textSize(20);
    p.text(suit, -58, -65);
    p.pop();

    glow(accent, 18);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(70);
    p.text(suit, 0, 2);
    clearGlow();

    p.textStyle(p.NORMAL);
    p.textFont('monospace');
    p.textSize(8);
    p.fill(246, 247, 255, 155);
    p.text('CDW // 2026', 0, 90);
    p.pop();
  }

  function drawCardDeck() {
    drawPlayingCard(334, 294, -0.23, 'A', '♥', '#ff4fcf', '#18051e');
    drawPlayingCard(438, 267, -0.08, 'K', '♠', '#00e5ff', '#031329');
    drawPlayingCard(548, 267, 0.08, 'Q', '♦', '#fff700', '#17160a');
    drawPlayingCard(652, 294, 0.23, 'J', '♣', '#9d5cff', '#100829');

    p.noFill();
    p.stroke(255, 43, 214, 90);
    p.strokeWeight(1);
    p.arc(493, 310, 520, 330, Math.PI + 0.34, Math.PI * 2 - 0.34);
  }

  function drawHeart(x, y, size, color) {
    p.push();
    p.translate(x, y);
    p.scale(size / 100);
    glow(color, 18);
    p.noStroke();
    p.fill(color);
    p.beginShape();
    p.vertex(0, 34);
    p.bezierVertex(-62, -4, -58, -62, -24, -66);
    p.bezierVertex(-4, -68, 0, -50, 0, -36);
    p.bezierVertex(0, -50, 4, -68, 24, -66);
    p.bezierVertex(58, -62, 62, -4, 0, 34);
    p.endShape(p.CLOSE);
    clearGlow();
    p.pop();
  }

  function drawHearts() {
    drawHeart(118, 124, 44, '#ff4fcf');
    drawHeart(626, 92, 30, '#00e5ff');
    drawHeart(878, 330, 54, '#ff4fcf');
    drawHeart(720, 390, 28, '#fff700');
    drawHeart(250, 438, 35, '#ff4fcf');
  }

  function drawHud() {
    p.noFill();
    p.stroke(0, 229, 255, 165);
    p.strokeWeight(1);
    p.rect(22, 20, 956, 520);
    p.line(22, 52, 190, 52);
    p.line(810, 52, 978, 52);
    p.noStroke();
    p.fill(0, 229, 255);
    p.textFont('monospace');
    p.textSize(13);
    p.text('NEON DECK / 01', 38, 43);
    p.fill(255, 138, 0);
    p.text('CARD PROTOCOL ONLINE', 790, 43);
    p.fill(246, 247, 255, 175);
    p.textSize(11);
    p.text('CYBER CASINO // FOUR SUITS + HEART SIGNAL', 38, 520);
  }
};

var myp5_1 = new p5(sketch1, 'canvas-container-1');
