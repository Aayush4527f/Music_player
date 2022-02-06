function delSong(songSrc) {
    playlist.splice(playlist.indexOf(songSrc), 1)
    prev_playlist.splice(playlist.indexOf(songSrc), 1)
    let songnames = []
    for (let i = 0; i < song.length; i++) {
        songnames.push(song[i].innerText)
    }
    let iofs = songnames.indexOf(songSrc.substring(0, songSrc.length - 4))
    songitem[iofs].remove()
    if(iofs == index){
        playBtnFunc(index,true)
        document.getElementById('playbtn').style.backgroundImage = 'url(pause.svg)'
    }
}

function clearPlaylist(p) {
    let l = document.getElementsByClassName('playlist_songitem').length
    for (let i = 0; i < l; i++) {
        if (p) { playlist.shift() }
        let j = song.length - 1
        songitem[j].remove()
    }
    index = 0
    playBtnFunc(index,true)
    a.src = 'http://localhost:8000/'
    document.getElementById('playbtn').style.backgroundImage = 'url(play.svg)'
}