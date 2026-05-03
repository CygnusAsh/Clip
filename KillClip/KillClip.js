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

// ===== フェード遷移 =====
document.querySelectorAll("a").forEach(link=>{
  link.addEventListener("click",e=>{
    const href = link.getAttribute("href");
    if(!href || href.startsWith("#")) return;

    e.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(()=>{
      window.location.href = href;
    },800);
  });
});

// 初期化
window.onload = ()=>{
  resize();
  init();
  animate();
};

window.onresize = resize;
