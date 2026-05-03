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

    // 🎥 動画クリック
    const img = card.querySelector(".thumb");
    if(img){
      img.addEventListener("click", ()=>{
        if(c.video) openModal(c.video);
      });
    }

    // 👤 プロフィール
    card.querySelector(".profile-btn").onclick = (e)=>{
      e.stopPropagation();
      if(c.profile){
        window.open(c.profile, "_blank");
      }
    };

    container.appendChild(card);
  });
}

// ===== モーダル =====
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");

function openModal(src){
  console.log("再生:", src); // ★デバッグ用

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
