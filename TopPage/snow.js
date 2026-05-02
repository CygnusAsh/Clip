const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let flakes = [];
const flakeCount = 130;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function createFlake(initial = false) {
  return {
    x: Math.random() * window.innerWidth,
    y: initial ? Math.random() * window.innerHeight : -10,
    r: Math.random() * 2.4 + 0.6,
    speedY: Math.random() * 1.1 + 0.35,
    speedX: Math.random() * 0.5 - 0.25,
    swing: Math.random() * 0.02 + 0.003,
    alpha: Math.random() * 0.45 + 0.2,
    blur: Math.random() * 2 + 0.5
  };
}

function initSnow() {
  flakes = [];
  for (let i = 0; i < flakeCount; i++) {
    flakes.push(createFlake(true));
  }
}

function drawFlake(flake) {
  ctx.beginPath();
  ctx.fillStyle = `rgba(255,255,255,${flake.alpha})`;
  ctx.shadowColor = "rgba(255,255,255,0.3)";
  ctx.shadowBlur = flake.blur;
  ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
  ctx.fill();
}

let time = 0;

function animateSnow() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];

    f.y += f.speedY;
    f.x += f.speedX + Math.sin((f.y + time) * f.swing) * 0.45;

    if (
      f.y > window.innerHeight + 20 ||
      f.x < -20 ||
      f.x > window.innerWidth + 20
    ) {
      flakes[i] = createFlake(false);
      flakes[i].x = Math.random() * window.innerWidth;
    }

    drawFlake(f);
  }

  time += 1;
  requestAnimationFrame(animateSnow);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
initSnow();
animateSnow();
