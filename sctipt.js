const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector("#playOrpause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar");

let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex); 
    playingNow();
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `covers/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;

    mainAudio.addEventListener("loadeddata", () => {
        const musicDuration = wrapper.querySelector(".duration");
        const audioDuration = mainAudio.duration;
        const totalMin = Math.floor(audioDuration / 60);
        const totalSec = Math.floor(audioDuration % 60).toString().padStart(2, '0');
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
}

function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.src = `icons/pause_FILL0_wght400_GRAD0_opsz48.svg`;
    mainAudio.play();
}

function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.src = `icons/play_arrow_FILL0_wght400_GRAD0_opsz48.svg`;
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
});

prevBtn.addEventListener("click", () => {
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60).toString().padStart(2, '0');
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getAlt = repeatBtn.alt;
    switch (getAlt) {
        case "repeat":
            repeatBtn.alt = "repeat-1";
            repeatBtn.title = "Song looped";
            repeatBtn.src = `icons/repeat_one_FILL0_wght400_GRAD0_opsz48.svg`;
            break;
        case "repeat-1":
            repeatBtn.alt = "shuffle";
            repeatBtn.title = "Playback shuffle";
            repeatBtn.src = `icons/shuffle_FILL0_wght400_GRAD0_opsz48.svg`;
            break;
        case "shuffle":
            repeatBtn.alt = "repeat";
            repeatBtn.title = "Playlist looped";
            repeatBtn.src = `icons/repeat_FILL0_wght400_GRAD0_opsz48.svg`;
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getAlt = repeatBtn.alt;
    switch (getAlt) {
        case "repeat":
            nextMusic();
            break;
        case "repeat-1":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            } while (musicIndex == randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

const musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].id}" src="music/NIRVANA NEVERMIND/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].id}" class="audio-duration">5:00</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].id}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].id}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60).toString().padStart(2, '0');
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerHTML = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}