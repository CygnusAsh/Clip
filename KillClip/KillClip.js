// ===== JSON読み込み =====
let clips = [];

fetch("./KillClip.json")
  .then(res => res.json())
  .then(data => {
    clips = data;
    renderClips(sortByDate([...clips]));
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

    card.innerHTML = `
      <div>${c.id}</div>
      <div>${c.player}</div>
      <div>${c.date}</div>

      <button class="profile-btn">Profile</button>

      <div class="thumb-wrapper">
        <img src="${c.thumbnail}" class="thumb">
      </div>
    `;

    // 🎥 クリック（ここが重要）
    const img = card.querySelector(".thumb");

    img.addEventListener("click", (e)=>{
      e.stopPropagation();

      console.log("クリック成功"); // ←これ出るか確認

      openModal(c.video);
    });

    // 👤 プロフィール
    card.querySelector(".profile-btn").addEventListener("click",(e)=>{
      e.stopPropagation();
      window.open(c.profile, "_blank");
    });

    container.appendChild(card);
  });
}

// ===== モーダル =====
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");

function openModal(src){
  console.log("動画:", src);

  modal.style.display = "flex";

  modalVideo.src = src;
  modalVideo.currentTime = 0;

  // 🔥 autoplay制限対策
  modalVideo.muted = true;

  modalVideo.play()
    .then(()=>{
      modalVideo.muted = false;
    })
    .catch(err=>{
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
  const value = e.target.value.toLowerCase();

  if(!value){
    renderClips(sortByDate([...clips]));
    return;
  }

  const filtered = clips.filter(c=>{
    return (
      c.id.toLowerCase().includes(value) ||
      c.player.toLowerCase().includes(value) ||
      c.date.includes(value)
    );
  });

  renderClips(sortByDate(filtered));
});
