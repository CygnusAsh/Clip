// ===== JSON読み込み =====
let clips = [];

fetch("./KillClip.json")
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
  return list.sort((a,b)=> new Date(b.date) - new Date(a.date));
}

// ===== カード生成 =====
const container = document.getElementById("cardContainer");

function renderClips(list){
  container.innerHTML = "";

  list.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";

    const thumb = c.thumbnail ? c.thumbnail : "../KCS/default.png";

    card.innerHTML = `
      <div>${c.id}</div>
      <div>${c.player}</div>
      <div>${c.date}</div>

      <button class="profile-btn">Profile</button>

      <div class="thumb-wrapper">
        <img src="${thumb}" class="thumb">
      </div>
    `;

    // 🎥 動画クリック（確実版）
    const img = card.querySelector(".thumb");

    if(img){
      img.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log("クリックOK");

        if(c.video){
          openModal(c.video);
        }
      });
    }

    // 👤 プロフィール
    const btn = card.querySelector(".profile-btn");

    if(btn){
      btn.addEventListener("click", (e)=>{
        e.stopPropagation();
        if(c.profile){
          window.open(c.profile, "_blank");
        }
      });
    }

    container.appendChild(card);
  });
}

// ===== モーダル =====
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");

function openModal(src){
  console.log("再生:", src);

  modal.style.display = "flex";
  modalVideo.src = src;
  modalVideo.currentTime = 0;

  modalVideo.play().catch(err=>{
    console.log("再生エラー:", err);
  });
}

// 閉じる
modal.addEventListener("click", ()=>{
  modal.style.display = "none";
  modalVideo.pause();
  modalVideo.src = "";
});

// ===== 検索 =====
document.getElementById("searchInput").addEventListener("input", e=>{
  const value = e.target.value;

  if(!value){
    renderClips(sortByDate([...clips]));
    return;
  }

  const keyword = value.toLowerCase();

  const filtered = clips.filter(c=>{
    return (
      c.id.toLowerCase().includes(keyword) ||
      c.player.toLowerCase().includes(keyword) ||
      c.date.includes(value)
    );
  });

  renderClips(sortByDate(filtered));
});

// ===== 雪 =====
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
