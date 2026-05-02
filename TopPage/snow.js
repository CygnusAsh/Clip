const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let flakes = [];
const count = window.innerWidth < 600 ? 120 : 200;

function resize() {
  const dpr = devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr,dpr);
}

function createFlake() {
  return {
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*2,
    vy: Math.random()+0.3
  };
}

function init() {
  flakes = [];
  for(let i=0;i<count;i++){
    flakes.push(createFlake());
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  flakes.forEach(f=>{
    f.y += f.vy;
    if(f.y > innerHeight) f.y = 0;

    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

resize();
init();
draw();

window.onresize = ()=>{
  resize();
  init();
};
