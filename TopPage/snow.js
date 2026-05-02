window.addEventListener("DOMContentLoaded", () => {

// ===== 要素 =====
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const overlay = document.getElementById("overlayText");

const bgm = document.getElementById("bgm");

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

  setTimeout(()=>{
    intro.style.display="none";
    main.classList.add("show");

    resize();
    init();
    animate();

    // BGM
    bgm.play().catch(()=>{});

    // メニュー表示
    setTimeout(()=>{
      overlay.classList.add("show");
    },1500);

  },500);

},{once:true});

// ===== 選択 =====
document.querySelectorAll(".menu-btn").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();

    overlay.classList.add("selecting");
    btn.classList.add("selected");
  });
});

window.onresize=resize;

});
