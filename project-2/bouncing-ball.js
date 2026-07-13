var sketch2 = function(p) {
  var particles = [];
  var columns = 16;
  var parentEl;

  p.setup = function() {
    parentEl = document.getElementById('canvas-container-2');
    var w = Math.max(700, parentEl.clientWidth || 800);
    var h = Math.floor(w * 0.5);
    var canvas = p.createCanvas(w, h);
    canvas.parent('canvas-container-2');

    for (var i = 0; i < 42; i++) {
      particles.push({
        angle: p.random(p.TWO_PI),
        speed: p.random(0.006, 0.018),
        orbit: p.random(24, 150),
        baseX: p.random(90, p.width - 90),
        baseY: p.random(90, p.height - 90),
        size: p.random(8, 26)
      });
    }
  };

  p.windowResized = function() {
    if (!parentEl) return;
    var w = Math.max(700, parentEl.clientWidth || 800);
    var h = Math.floor(w * 0.5);
    p.resizeCanvas(w, h);
  };

  p.draw = function() {
    p.background(18, 26, 38);
    drawGradientBands();
    drawGrid();
    drawParticles();
    drawCursorField();
  };

  function drawGradientBands() {
    p.noStroke();
    for (var y = 0; y < p.height; y += 8) {
      var amount = y / p.height;
      p.fill(22 + amount * 24, 34 + amount * 18, 50 + amount * 26, 180);
      p.rect(0, y, p.width, 8);
    }
  }

  function drawGrid() {
    p.stroke(0, 229, 255, 46);
    p.strokeWeight(1);
    for (var i = 0; i <= columns; i++) {
      var x = p.map(i, 0, columns, 40, p.width - 40);
      p.line(x, 38, x, p.height - 38);
    }
    for (var y = 58; y < p.height; y += 42) {
      p.line(38, y, p.width - 38, y);
    }
  }

  function drawParticles() {
    var mouseInfluence = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2);
    var colorShift = p.map(mouseInfluence, 0, p.width / 2, 0, 1, true);
    var pulse = (p.sin(p.frameCount * 0.018) + 1) * 0.5;
    var outerStart = p.color(255, 247, 0, 175);
    var outerEnd = p.color(0, 140, 255, 175);
    var innerStart = p.color(0, 229, 255, 235);
    var innerEnd = p.color(122, 53, 255, 235);
    var outerColor = p.lerpColor(outerStart, outerEnd, colorShift);
    var innerColor = p.lerpColor(innerStart, innerEnd, p.constrain(colorShift * 0.7 + pulse * 0.3, 0, 1));

    p.noStroke();
    for (var i = 0; i < particles.length; i++) {
      var particle = particles[i];
      particle.angle += particle.speed;

      var pull = p.dist(p.mouseX, p.mouseY, particle.baseX, particle.baseY);
      var attraction = p.map(pull, 0, 360, 1.55, 0.65, true);
      var x = particle.baseX + p.cos(particle.angle) * particle.orbit * attraction;
      var y = particle.baseY + p.sin(particle.angle * 1.4) * particle.orbit * 0.35;
      var size = particle.size * p.map(pull, 0, 300, 1.7, 0.75, true);

      p.fill(outerColor);
      p.circle(x, y, size * 2.2);
      p.fill(innerColor);
      p.circle(x, y, size);
    }
  }

  function drawCursorField() {
    var mx = p.constrain(p.mouseX, 0, p.width);
    var my = p.constrain(p.mouseY, 0, p.height);

    p.noFill();
    var cursorShift = p.map(mx, 0, p.width, 0, 1, true);
    var ringColor = p.lerpColor(p.color(0, 229, 255, 190), p.color(122, 53, 255, 190), cursorShift);
    var crossColor = p.lerpColor(p.color(255, 247, 0, 225), p.color(0, 229, 255, 225), cursorShift);

    p.stroke(ringColor);
    p.strokeWeight(2);
    p.circle(mx, my, 70);
    p.circle(mx, my, 120);

    p.stroke(crossColor);
    p.strokeWeight(4);
    p.line(mx - 28, my, mx + 28, my);
    p.line(mx, my - 28, mx, my + 28);

    p.noStroke();
    p.fill(0, 229, 255);
    p.textSize(12);
    p.text('move cursor to bend the field', 42, p.height - 24);
  }

  p.mousePressed = function() {
    for (var i = 0; i < particles.length; i++) {
      particles[i].baseX = p.lerp(particles[i].baseX, p.mouseX, p.random(0.08, 0.22));
      particles[i].baseY = p.lerp(particles[i].baseY, p.mouseY, p.random(0.08, 0.22));
    }
  };
};

var myp5_2 = new p5(sketch2, 'canvas-container-2');
