"use strict";

const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

//Вызов загрузки музыка после открытия окна
window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
    changeVolumeMusic();
});

let loadMusic = (indexNum) => {
    musicName.innerText = allMusic[indexNum - 1].name;
    musicArtist.innerText = allMusic[indexNum - 1].artist;
    musicImg.src = `content/img/${allMusic[indexNum - 1].img}.jpg`;
    mainAudio.src = `content/songs/${allMusic[indexNum - 1].src}.mp3`;
};

let playMusic = () => {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
};
let pauseMusic = () => {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
};

//Кнопка Паузы и Плей
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

let nextMusic = () => {
    musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    } else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
};

nextBtn.addEventListener("click", () => {
    nextMusic();
});

let prevMusic = () => {
    musicIndex--;
    if (musicIndex < 1) {
        musicIndex = allMusic.length;
    } else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
};

prevBtn.addEventListener("click", () => {
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //текущее время трека
    const duration = e.target.duration; //Общее время трека

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {

        //Обновление общего времени трека
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //Обновление текущего времени трека
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Перемотка с помощью прогресс бара
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; // берем ширину прогресс бара
    let clickedOffSetX = e.offsetX; // берем значение оси x
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

//Повтор трека

const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

//Кнопки открыть и скрыть плейлист 
showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector('ul');

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index = "${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class ="${allMusic[i].src}" src="content/songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                 </li>`;
    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);


    liAudioTag.addEventListener("loadeddata", () => {
        //Обновление общего времени трека
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    });
}

function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
        }

        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function changeVolumeMusic() {
    let audio = mainAudio;
    let volume = document.querySelector("#volume-control");

    volume.addEventListener("input", function (e) {
        audio.volume = e.currentTarget.value / 100;
    });
}