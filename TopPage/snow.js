window.addEventListener("DOMContentLoaded", () => {

// ===== 要素 =====
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const overlay = document.getElementById("overlayText");

const bgm = document.getElementById("bgm");
const toggle = document.getElementById("toggle");
const volume = document.getElementById("volume");

bgm.volume = 0;

// ===== Canvas =====
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let flakes = [];
let cursorFlakes = [];

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function createFlake(){
  return {
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*2,
    vy:Math.random()+0.3
  };
}

function init(){
  flakes=[];
  for(let i=0;i<150;i++) flakes.push(createFlake());
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景雪
  flakes.forEach(f=>{
    f.y+=f.vy;
    if(f.y>innerHeight)f.y=0;

    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
  });

  // カーソル雪
  for(let i=cursorFlakes.length-1;i>=0;i--){
    const f = cursorFlakes[i];

    f.x+=f.vx;
    f.y+=f.vy;
    f.life--;

    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,"+(f.life/60)+")";
    ctx.fill();

    if(f.life<=0) cursorFlakes.splice(i,1);
  }

  requestAnimationFrame(animate);
}

// ===== カーソル =====
window.addEventListener("mousemove",e=>{
  for(let i=0;i<3;i++){
    cursorFlakes.push({
      x:e.clientX,
      y:e.clientY,
      r:Math.random()*2,
      vx:(Math.random()-0.5)*2,
      vy:(Math.random()-1.5),
      life:60
    });
  }
});

// ===== 開始 =====
window.addEventListener("click",()=>{

  intro.classList.add("open");

  setTimeout(()=>{
    intro.style.display="none";
    main.classList.add("show");

    resize();
    init();
    animate();

    // BGM
    bgm.play().catch(()=>{});
    let v=0;
    const fade=setInterval(()=>{
      v+=0.02;
      bgm.volume=v;
      if(v>=0.5) clearInterval(fade);
    },100);

    // メニュー表示（確実にここで出る）
    setTimeout(()=>{
      overlay.classList.add("show");
    },1500);

  },1000);

},{once:true});

// ===== UI =====
toggle.onclick = ()=>{
  if(bgm.paused){
    bgm.play();
    toggle.textContent="⏸";
  }else{
    bgm.pause();
    toggle.textContent="▶";
  }
};

volume.oninput = ()=>{
  bgm.volume = volume.value;
};

// ===== 選択 =====
document.querySelectorAll(".menu-btn").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();

    overlay.classList.add("selecting");
    btn.classList.add("selected");

    setTimeout(()=>{
      location.href = btn.href;
    },500);
  });
});

window.onresize=resize;

});
