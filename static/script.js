/*
    remove                                      (done for now atleast)
    ------------------------------------------------------------------
    clear playlist                              (done for now atleast)
    ------------------------------------------------------------------
    shuffle playlist
    ------------------------------------------------------------------
    play button
    ------------------------------------------------------------------
    previous btn
    ------------------------------------------------------------------
    next btn
    ------------------------------------------------------------------
    make playlist draggable
    ------------------------------------------------------------------
    progress bar
    ------------------------------------------------------------------
    start and end time
    ------------------------------------------------------------------
    thumbnail and name of song on right side
*/






let songs = []
let savedSongs = []
let playlist = []
let a = document.getElementById('audio')
let songitem = document.getElementsByClassName('playlist_songitem')
let song = document.getElementsByClassName('playlist_song')
const PORT = 8000
const playlistDiv = document.getElementById('playlist')
const allSongsDiv = document.getElementById('songs')

fetch('/songslist').then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            songs.push(data[i])
        }
    });

fetch('/saved').then((response) => response.json())
    .then((data) => {
        something = JSON.parse(data)
        for (let i = 0; i < something.length; i++) {
            savedSongs.push(something[i])
        }
    });
function loadPlaylist() {
    for (let i = 0; i < savedSongs.length; i++) {
        addSong(savedSongs[i],true)
    }
}
function initialise() {
    for (let i = 0; i < songs.length; i++) {
        let song_name = songs[i].substring(0, songs[i].length - 4)

        let songitem = document.createElement('div')
        let song = document.createElement('div')
        let circle = document.createElement('div')


        song.className = 'song'
        song.innerText = song_name

        circle.className = 'circle'
        circle.addEventListener('click', () => { addSong(songs[i],true); playlistDiv.scrollTop = playlistDiv.scrollHeight; })

        allSongsDiv.appendChild(songitem)

        songitem.className = 'songitem'
        songitem.appendChild(song)
        songitem.appendChild(circle)
    }
    loadPlaylist()
}
setTimeout(() => {
    initialise()
}, 100);

function savePlaylist() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let cname = 'playlist'
    document.cookie = cname + "=" + JSON.stringify(playlist) + ";" + expires + ";path=/";
}

function addSong(s,p) {
    let iofs = songs.indexOf(s)

    if(p){playlist.push(songs[iofs])}

    let song_name = songs[iofs].substring(0, songs[iofs].length - 4)

    let newSongitem = document.createElement('div')
    let song = document.createElement('div')
    let circle = document.createElement('div')
    let rembtn = document.createElement('div')


    song.className = 'playlist_song'
    song.innerText = song_name

    circle.className = 'circle'

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
}


function clearPlaylist(p) {
    let l = document.getElementsByClassName('playlist_songitem').length
    for (let i = 0; i < l; i++) {
        if(p){playlist.shift()}
        let j = song.length - 1
        songitem[j].remove()
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
            addSong(x,false)
        }
    }