console.log("a");
let cs = new Audio();
let s;
let cf;
let p = document.getElementById("playbut");
let sn = document.querySelector(".songinfo");
let st = document.querySelector(".songtime");
async function getsongs(folder) {
    cf = folder;
    let a = await fetch(`http://127.0.0.1:3000/${cf}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${cf}/`)[1]);
        }
    }
    s = songs;
    let songul = document.querySelector(".savedsongs").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of s) {
        songul.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>${"harry"}</div>
                </div>
                <div>play now</div>
                <img class="invert" src="play.svg" alt="">
            </li>`;
    }
    Array.from(document.querySelector(".savedsongs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            play(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
    return songs;
}
const play = (track, pause = false) => {
    cs.src = (`/${cf}/` + track);
    if (!pause) {
        cs.play();
        p.src = "pause.svg"
    }
    sn.innerHTML = decodeURI(track);
    st.innerHTML = "00:00/00:00"

};
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always show two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function Albums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let ab = div.getElementsByTagName("a");
    let array = Array.from(ab);
    let cardcon = document.querySelector(".cardcon");
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardcon.innerHTML += `<div class="card" data-folder="${folder}">
                              <img src="/songs/${folder}/cover.jpeg" alt="" style="border-radius: 120px;">
                            <h2>${response.title}</h2>
                            <p>${response.discription}</p>
                            <div class="play-button"></div>
                        </div>`

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async (i) => {
            s = await getsongs(`songs/${i.currentTarget.dataset.folder}`);
            play(s[0])
        })
    });
}
async function main() {
    const songs = await getsongs("songs/ncs");
    play(s[0], true);
    Albums();
    p.addEventListener("click", () => {
        if (cs.paused) {
            cs.play();
            p.src = "pause.svg";
        } else {
            cs.pause();
            p.src = "play.svg";
        }
    });
    cs.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(cs.currentTime)}/${formatTime(cs.duration)}`;
        let cc = (cs.currentTime / cs.duration) * 100;
        document.querySelector(".circle").style.left = cc + 1 + "%";

    })
    document.querySelector(".loadbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"; cs.currentTime = ((cs.duration) * percent) / 100;
    })
    document.getElementById("hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = -120 + "%";
    })
    prevbut.addEventListener("click", () => {
        let index = s.indexOf(cs.src.split("/").slice(-1)[0]);
        play(s[index - 1]);
    })
    nextbut.addEventListener("click", () => {
        let index = s.indexOf(cs.src.split("/").slice(-1)[0]);
        play(s[index + 1]);
    })
    sound.addEventListener("change", (e) => {
        cs.volume = parseInt(e.target.value) / 100;
    })
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async (i) => {
            s = await getsongs(`songs/${i.currentTarget.dataset.folder}`);
            console.log("eeee")
        })
    });
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("vol.svg")) {
            e.target.src = e.target.src.replace("vol.svg", "mute.svg");
            cs.volume = 0;
            sound.value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "vol.svg");
            cs.volume = 0.1;
            sound.value = 10;
        }
    })

}

main()