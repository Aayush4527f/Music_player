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