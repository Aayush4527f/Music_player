function playBtnFunc(index, p) {

    if (a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    } else if (!a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(play.svg)'
    }

    if (!a.paused && a.currentTime > 0.01 && !p) {
        a.pause()
        // console.log('paused')
    } else {
        if (a.src == `http://localhost:${PORT}/${encodeURI(playlist[index])}`) {
            a.play()
            // console.log('played',a.src,`http://localhost:${PORT}/${encodeURI(playlist[index])}`)
        } else if (a.src != `http://localhost:${PORT}/${encodeURI(playlist[index])}`) {
            // console.log('setted src',a.src,`http://localhost:${PORT}/${encodeURI(playlist[index])}`)
            a.src = playlist[index]
        }
        a.play()
        for (let i = 0; i < playlist_circle.length; i++) {
            if (i == index) {
                playlist_circle[i].style.border = '10px #fff solid'
            }
            else if (i != index) {
                playlist_circle[i].style.border = '10px #00C2FF solid'
            }
        }
    }
}
let shuf_state = 0
function shuffle() {

    if (shuf_state == 1) {
        playlist = prev_playlist.slice()
        for (const x of songitem) {
            clearPlaylist(false)
        }
        for (const x of playlist) {
            addSong(x, false)
        }
        shuf_state = 0
    } else if (shuf_state == 0) {
        let currentIndex = playlist.length, randomIndex;
        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [playlist[randomIndex], playlist[currentIndex]] = [playlist[currentIndex], playlist[randomIndex]];
        }
        for (const x of songitem) {
            clearPlaylist(false)
        }
        for (const x of playlist) {
            addSong(x, false)
        }
        shuf_state = 1
    }
    index = 0
    playBtnFunc(index, true)
    document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
}

function next() {
    if (index < playlist.length - 1) {
        index++
        playBtnFunc(index, true)
    }
    document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
}
function previous() {
    if (index > 0) {
        index--
        playBtnFunc(index, true)
    }
    document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
}