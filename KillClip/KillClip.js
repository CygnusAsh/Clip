// ===== JSON読み込み =====
let clips = [];

fetch("KillClip.json")
  .then(res => res.json())
  .then(data => {
    clips = data;
    renderClips(sortByDate([...clips]));
  })
  .catch(err => {
    console.error("JSON読み込みエラー:", err);
  });

// ===== 日付ソート =====
function sortByDate(list){
  return list.sort((a,b)=>{
    return new Date(b.date) - new Date(a.date);
  });
}

// ===== カード生成 =====
const container = document.getElementById("cardContainer");

function renderClips(list){
  container.innerHTML = "";

  list.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-id">${c.id}</div>
      <div class="card-player">${c.player}</div>
      <div class="card-date">${c.date}</div>

      <button class="profile-btn">Profile</button>

      <div class="thumb-wrapper">
        <img src="${c.thumbnail}" class="thumb">
      </div>
    `;

    // 🎥 サムネクリック → 動画再生
    card.querySelector(".thumb").onclick = ()=>{
      openModal(c.video);
    };

    // 👤 プロフィールボタン
    card.querySelector(".profile-btn").onclick = (e)=>{
      e.stopPropagation();
      if(c.profile){
        window.open(c.profile, "_blank");
      }
    };

    container.appendChild(card);
  });
}

// ===== 検索 =====
const input = document.getElementById("searchInput");

input.addEventListener("input", ()=>{
  const keyword = input.value.toLowerCase();

  const filtered = clips.filter(c=>{
    return (
      c.id.toLowerCase().includes(keyword) ||
      c.player.toLowerCase().includes(keyword) ||
      c.date.toLowerCase().includes(keyword)
    );
  });

  renderClips(sortByDate(filtered));
});

// ===== モーダル =====
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");

function openModal(src){
  modal.style.display = "flex";
  modalVideo.src = src;
  modalVideo.currentTime = 0;
  modalVideo.play();
}

modal.onclick = ()=>{
  modal.style.display = "none";
  modalVideo.pause();
};

// ===== 雪エフェクト =====
const canvas = document.getElementById("snow");

if(canvas){
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
      if(f.y>innerHeight) f.y=0;

      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle="white";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("load", ()=>{
    resize();
    init();
    animate();
  });

  window.addEventListener("resize", ()=>{
    resize();
    init();
  });
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
