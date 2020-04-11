const {
    app, process
} = require('electron').remote

let shell = require('electron').shell
document.addEventListener('click', function (event) {
    if (event.target.parentElement.tagName === 'A' && event.target.parentElement.href.startsWith('https')) {
        event.preventDefault()
        shell.openExternal(event.target.parentElement.href)
    }
})

document.getElementById('appversion').innerHTML = app.getVersion();
document.getElementById('electronversion').innerHTML = process.versions.electron;