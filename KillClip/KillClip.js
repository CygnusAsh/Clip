// ===== BGM =====
const bgm = new Audio("../TopPage/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.5;

// 再生位置復元
const savedTime = sessionStorage.getItem("bgmTime");
if(savedTime){
  bgm.currentTime = savedTime;
}

// 初回クリックで再生
window.addEventListener("click", ()=>{
  bgm.play().catch(()=>{});
}, { once:true });

// ===== 雪 =====
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let flakes = [];

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

  flakes.forEach(f=>{
    f.y+=f.vy;
    if(f.y>innerHeight)f.y=0;

    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// フェード
document.querySelectorAll("a").forEach(link=>{
  link.addEventListener("click",e=>{
    e.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(()=>{
      window.location.href = link.href;
    },800);
  });
});

window.onload = ()=>{
  resize();
  init();
  animate();
};

window.onresize = resize;
