function savePlaylist() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let cname = 'playlist'
    document.cookie = cname + "=" + JSON.stringify(playlist) + ";" + expires + ";path=/";
}