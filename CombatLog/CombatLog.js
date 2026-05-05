
let clips = [];

fetch("./CombatLog.json")
  .then(res => res.json())
  .then(data => {
    clips = data;
    renderClips(sortByDate([...clips]));
  });


function sortByDate(list){
  return list.sort((a,b)=> new Date(b.date) - new Date(a.date));
}

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


    const img = card.querySelector(".thumb");

    img.addEventListener("click", (e)=>{
      e.stopPropagation();

      console.log("OK");

      openModal(c.video);
    });


    card.querySelector(".profile-btn").addEventListener("click",(e)=>{
      e.stopPropagation();
      window.open(c.profile, "_blank");
    });

    container.appendChild(card);
  });
}


const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");

function openModal(src){
  console.log("video:", src);

  modal.style.display = "flex";

  modalVideo.src = src;
  modalVideo.currentTime = 0;

  modalVideo.muted = true;

  modalVideo.play()
    .then(()=>{
      modalVideo.muted = false;
    })
    .catch(err=>{
      console.log("Error:", err);
    });
}


modal.addEventListener("click", ()=>{
  modal.style.display = "none";
  modalVideo.pause();
  modalVideo.src = "";
});


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
