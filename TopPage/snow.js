// ===== 要素 =====
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const ui = document.getElementById("ui");

const bgm = document.getElementById("bgm");
const toggle = document.getElementById("toggle");
const volume = document.getElementById("volume");

const overlay = document.getElementById("overlayText");

bgm.volume = 0;
let started = false;

/* ===== 雪（背景） ===== */
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let flakes = [];
const count = innerWidth < 600 ? 120 : 200;

/* ===== カーソル雪 ===== */
let cursorFlakes = [];
let mouseX = 0;
let mouseY = 0;

/* ===== リサイズ ===== */
function resize() {
  const dpr = devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr,dpr);
}

/* ===== 雪生成 ===== */
function createFlake() {
  return {
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*2,
    vy: Math.random()+0.3
  };
}

function initSnow() {
  flakes = [];
  for(let i=0;i<count;i++) flakes.push(createFlake());
}

/* ===== アニメーション ===== */
function animateSnow() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景の雪
  flakes.forEach(f=>{
    f.y += f.vy;
    if(f.y > innerHeight) f.y = 0;

    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  // カーソル雪
  for (let i = cursorFlakes.length - 1; i >= 0; i--) {
    const f = cursorFlakes[i];

    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.03;
    f.life--;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${f.life / 60})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "white";
    ctx.fill();

    if (f.life <= 0) {
      cursorFlakes.splice(i, 1);
    }
  }

  requestAnimationFrame(animateSnow);
}

/* ===== マウス追従 ===== */
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  for(let i=0;i<2;i++){
    cursorFlakes.push({
      x: mouseX,
      y: mouseY,
      r: Math.random()*2 + 0.5,
      vx: (Math.random()-0.5)*1.5,
      vy: Math.random()*-1.5 - 0.5,
      life: 60
    });
  }
});

/* ===== スマホ対応 ===== */
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouseX = t.clientX;
  mouseY = t.clientY;

  for(let i=0;i<2;i++){
    cursorFlakes.push({
      x: mouseX,
      y: mouseY,
      r: Math.random()*2 + 0.5,
      vx: (Math.random()-0.5)*1.5,
      vy: Math.random()*-1.5 - 0.5,
      life: 60
    });
  }
});

/* ===== 開始 ===== */
function startExperience() {
  if (started) return;
  started = true;

  intro.classList.add("open");

  setTimeout(() => {
    bgm.play().catch(()=>{});

    let v = 0;
    const fade = setInterval(()=>{
      v += 0.02;
      bgm.volume = v;
      if(v >= 0.5) clearInterval(fade);
    },100);

    resize();
    initSnow();
    animateSnow();

    ui.classList.add("show");

  }, 1000);

  setTimeout(() => {
    intro.style.display = "none";
    main.classList.add("show");
  }, 1200);
}

/* ===== UI ===== */
toggle.onclick = () => {
  if (bgm.paused) {
    bgm.play();
    toggle.textContent = "⏸";
  } else {
    bgm.pause();
    toggle.textContent = "▶";
  }
};

volume.oninput = () => {
  bgm.volume = volume.value;
};

/* ===== メニュー表示 ===== */
setTimeout(() => {
  overlay.classList.add("show");
}, 2000);

/* ===== 選択演出 ===== */
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const href = btn.getAttribute("href");

    overlay.classList.add("selecting");
    btn.classList.add("selected");

    setTimeout(() => {
      overlay.classList.add("centering");
    }, 200);

    setTimeout(() => {
      document.body.style.transition = "opacity 0.4s";
      document.body.style.opacity = "0";

      setTimeout(() => {
        location.href = href;
      }, 400);
    }, 600);
  });
});

/* ===== イベント ===== */
window.addEventListener("click", startExperience, { once: true });
window.addEventListener("touchstart", startExperience, { once: true });

window.onresize = () => {
  resize();
  initSnow();
};
