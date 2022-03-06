// VARIABLES
let songs = []
let savedSongs = []
let playlist = []
let prev_playlist = []
let index = 0
// DOCUMENT VARIABLES
let a = document.getElementById('audio')
let songitem = document.getElementsByClassName('playlist_songitem')
let song = document.getElementsByClassName('playlist_song')
let playlist_circle = document.getElementsByClassName('playlist_circle')
let circle = document.getElementsByClassName('circle')
let MyPlaylist = document.getElementById('MyPlaylist')
let songsdiv = document.getElementById('songs')
const playlistDiv = document.getElementById('playlist')
const allSongsDiv = document.getElementById('songs')
// port
const PORT = 8000

// adding event listners
document.getElementById('playbtn').addEventListener('click', () => { playBtnFunc(index) })
document.getElementById('nextbtn').addEventListener('click', () => { next() })
document.getElementById('prevbtn').addEventListener('click', () => { previous() })

// fetching songs list and saved songs(from cookie)
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

// loading the songs saved in cookie
function loadPlaylist() {
    for (let i = 0; i < savedSongs.length; i++) {
        addSong(savedSongs[i], true)
    }
    prev_playlist = playlist.slice()
}

function initialise() {
    for (let i = 0; i < songs.length; i++) {
        // cutting '.mp3' from song url
        let song_name = songs[i].substring(0, songs[i].length - 4)
        // console.log(song_name)

        // creating songitem div with all its necessary elements
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


function addSong(s, p) {
    // iofs = index of song
    let iofs = songs.indexOf(s)

    // adding song in playlist arrays
    if (p) { playlist.push(songs[iofs]) }
    if (p) { prev_playlist.push(songs[iofs]) }

    let song_name = songs[iofs].substring(0, songs[iofs].length - 4)

    // adding song i UI
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
    // splice => removes a specific number of values from a specific locations in an array
    playlist.splice(playlist.indexOf(songSrc), 1)
    prev_playlist.splice(playlist.indexOf(songSrc), 1)

    // creating a temp copy of original song list so that original remains untouched
    let songnames = []
    for (let i = 0; i < song.length; i++) {
        songnames.push(song[i].innerText)
    }
    // removing song from UI
    let iofs = songnames.indexOf(songSrc.substring(0, songSrc.length - 4))
    songitem[iofs].remove()
    
    // if the song playing is deleted then the next one will take it's place and that will be played
    if (iofs == index) {
        playBtnFunc(index, true)
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    }
}

function clearPlaylist(p) {
    // just running delsong in a for loop and setting a.src to normal at the end
    let l = document.getElementsByClassName('playlist_songitem').length
    for (let i = 0; i < l; i++) {
        if (p) { playlist.shift() }
        let j = song.length - 1
        songitem[j].remove()
    }
    index = 0
    playBtnFunc(index, true)
    a.src = 'http://localhost:8000/'
    document.getElementById('playbtn').style.backgroundImage = 'url(play.svg)'
}
function playBtnFunc(index, p) {
    // the 'p' variable ensure that the song will be playing when it's true no matter how many times the function is called or what's the state of song
    
    // changing the button image accordingly
    if (a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    } else if (!a.paused) {
        document.getElementById('playbtn').style.backgroundImage = 'url(play.svg)'
    }
    // if it's playing and 'p' is false then pause
    if (!a.paused && a.currentTime > 0.01 && !p) {
        a.pause()
    }
    else {
        // if the source is already set according to the index then just play the song
        if (a.src == `http://localhost:${PORT}/${encodeURI(playlist[index])}`) {
            a.play()
        }
        // if the source is not set according to the index then set it
        else if (a.src != `http://localhost:${PORT}/${encodeURI(playlist[index])}`) {
            a.src = playlist[index]
        }
        a.play()

        // UI stuff (changing the color of circle of the song which is playing currently)
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

// an on/off kind of shuffle functionality where you toggle between states
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

function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if (sec >= 3600) { return hours + ':' + minutes + ':' + seconds } else { return minutes + ':' + seconds; }
}
function progressBar() {
    let x = convertHMS(a.currentTime)
    let y = convertHMS(a.duration)
    let p1 = document.getElementById('currTime')
    let p2 = document.getElementById('duration')
    let main_bar = document.getElementById('main-bar')
    let p = a.currentTime * 100 / a.duration
    let loading = document.getElementById('loading')
    let black_bar = document.getElementById('black-bar')


    //loading part
    if (a.buffered.length == 0 && a.src != 'http://localhost:8000/' && a.src != 'http://localhost:8000/undefined') {
        loading.style.display = 'block'
        main_bar.style.display = 'none'
        black_bar.style.display = 'none'
        p1.style.display = 'none'
        p2.style.display = 'none'
        document.getElementById('playbtn').style.display = 'none'
    } else {
        loading.style.display = 'none'
        main_bar.style.display = ''
        black_bar.style.display = ''
        p1.style.display = ''
        p2.style.display = ''
        document.getElementById('playbtn').style.display = ''

        //  time display part
        p1.innerText = x
        p2.innerText = y
        if (y == 'NaN:NaN') { p2.innerText = '00:00' } else { p2.innerText = y }

        //  bar part
        main_bar.style.width = `${p}%`
    }


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

function savePlaylist() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let cname = 'playlist'
    document.cookie = cname + "=" + JSON.stringify(playlist) + ";" + expires + ";path=/";
}
// save all songs in the playlist to a cookie