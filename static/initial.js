let songs = []
let savedSongs = []
let playlist = []
let prev_playlist = []
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
    prev_playlist = playlist.slice()
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