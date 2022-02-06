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