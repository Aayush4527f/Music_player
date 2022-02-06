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
    if (a.buffered.length == 0 && a.src != 'http://localhost:8000/') {
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
