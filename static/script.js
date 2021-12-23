/*
    remove                                      (done for now atleast)
    ------------------------------------------------------------------
    clear playlist                              (done for now atleast)
    ------------------------------------------------------------------
    shuffle playlist                            (done for now atleast)
    ------------------------------------------------------------------
    play button                                 (done for now atleast)
    ------------------------------------------------------------------
    previous btn                                (done for now atleast)
    ------------------------------------------------------------------
    next btn                                    (done for now atleast)
    ------------------------------------------------------------------
    make playlist draggable
    ------------------------------------------------------------------
    progress bar                                (done for now atleast)
    ------------------------------------------------------------------
    start and end time                          (done for now atleast)
    ------------------------------------------------------------------
    change shuffle to how it actually should be 
    ------------------------------------------------------------------
    convert HMS
*/

let songs = []
let savedSongs = []
let playlist = []
let index = 0
let a = document.getElementById('audio')
let songitem = document.getElementsByClassName('playlist_songitem')
let song = document.getElementsByClassName('playlist_song')
let playlist_circle = document.getElementsByClassName('playlist_circle')
let circle = document.getElementsByClassName('circle')
let MyPlaylist = document.getElementById('MyPlaylist')
let songsdiv = document.getElementById('songs')
const PORT = 8000
const playlistDiv = document.getElementById('playlist')
const allSongsDiv = document.getElementById('songs')
document.getElementById('playbtn').addEventListener('click', () => { playBtnFunc(index) })
document.getElementById('nextbtn').addEventListener('click', () => { next() })
document.getElementById('prevbtn').addEventListener('click', () => { previous() })

fetch('/songslist').then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            songs.push(data[i])
        }
    });

fetch('/saved').then((response) => response.json())
    .then((data) => {
        let something = JSON.parse(data)
        for (let i = 0; i < something.length; i++) {
            savedSongs.push(something[i])
        }
    });
function loadPlaylist() {
    for (let i = 0; i < savedSongs.length; i++) {
        addSong(savedSongs[i], true)
    }
}
function initialise() {
    for (let i = 0; i < songs.length; i++) {
        let song_name = songs[i].substring(0, songs[i].length - 4)
        // console.log(song_name)

        let songitem = document.createElement('div')
        let song = document.createElement('div')
        let circle = document.createElement('div')


        song.className = 'song'
        song.innerText = song_name

        circle.className = 'circle'
        circle.addEventListener('click', () => { addSong(songs[i], true); playlistDiv.scrollTop = playlistDiv.scrollHeight; })

        allSongsDiv.appendChild(songitem)

        songitem.className = 'songitem'
        songitem.appendChild(song)
        songitem.appendChild(circle)
    }
}
setTimeout(() => {
    initialise()
    loadPlaylist()
}, 100);

function savePlaylist() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let cname = 'playlist'
    document.cookie = cname + "=" + JSON.stringify(playlist) + ";" + expires + ";path=/";
}

function addSong(s, p) {
    let iofs = songs.indexOf(s)

    if (p) { playlist.push(songs[iofs]) }

    let song_name = songs[iofs].substring(0, songs[iofs].length - 4)
    // console.log(songs[iofs])

    let newSongitem = document.createElement('div')
    let song = document.createElement('div')
    let circle = document.createElement('div')
    let rembtn = document.createElement('div')


    song.className = 'playlist_song'
    song.innerText = song_name

    circle.className = 'playlist_circle'
    circle.addEventListener('click', () => {
        index = playlist.indexOf(s)
        playBtnFunc(index, true)
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    })

    rembtn.className = 'rembtn'
    rembtn.addEventListener('click', () => { delSong(songs[iofs]) })

    playlistDiv.appendChild(newSongitem)

    newSongitem.className = 'playlist_songitem'
    newSongitem.style.order = songitem.length - 1
    newSongitem.appendChild(song)
    newSongitem.appendChild(circle)
    newSongitem.appendChild(rembtn)
}


function delSong(songSrc) {
    playlist.splice(playlist.indexOf(songSrc), 1)

    let songnames = []
    for (let i = 0; i < song.length; i++) {
        songnames.push(song[i].innerText)
    }
    let iofs = songnames.indexOf(songSrc.substring(0, songSrc.length - 4))
    songitem[iofs].remove()
    a.pause()
}


function clearPlaylist(p) {
    let l = document.getElementsByClassName('playlist_songitem').length
    for (let i = 0; i < l; i++) {
        if (p) { playlist.shift() }
        let j = song.length - 1
        songitem[j].remove()
    }
    index = 0
    playBtnFunc(index, true)
}
function playBtnFunc(index, p) {

    if (a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    } else if (!a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(play.svg)'
    }

    if (!a.paused && a.currentTime > 1 && !p) {
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
function shuffle() {
    let currentIndex = songitem.length, randomIndex;
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
function convertHMS(value) {
    //  _________________________________________improve this function___________________________________________

    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds; // Return is MM : SS
}

function progressBar() {
    //  time display part
    let x = convertHMS(a.currentTime)
    let y = convertHMS(a.duration)
    let p1 = document.getElementById('currTime')
    let p2 = document.getElementById('duration')
    p1.innerText = x
    p2.innerText = y
    if (y == 'NaN:NaN') { p2.innerText = '00:00' } else { p2.innerText = y }

    //  bar part
    let main_bar = document.getElementById('main-bar')
    let p = a.currentTime * 100 / a.duration
    main_bar.style.width = `${p}%`
}
setInterval(() => {
    progressBar()
}, 100);


function changebtn() {
    if (songsdiv.style.display != "none") {
        songsdiv.style.display = 'none'
        MyPlaylist.style.display = 'block'
        document.getElementById('changebtn').style.backgroundColor = '#17313A'
    } else if (songsdiv.style.display == "none") {
        songsdiv.style.display = 'block'
        MyPlaylist.style.display = 'none'
        document.getElementById('changebtn').style.backgroundColor = '#000000'
    }
}