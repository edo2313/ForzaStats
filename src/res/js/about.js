const {
    app, process
} = require('electron').remote;

const MDCDialog = require('@material/dialog').MDCDialog;
const successdialog = new MDCDialog(document.getElementById('success'));

// Open a connection
var socket = new WebSocket('ws://localhost:9999/');

// When a connection is made
socket.onopen = function () {
    console.log('Opened connection');
}

socket.onmessage = function (event) {
    if(event.data == 'OK') {
        successdialog.open();
        return;        
    }
}

function enableLocalhost(){
    socket.send('{"enableLocalhost": "" }');
}


let shell = require('electron').shell;
document.addEventListener('click', function (event) {
    if (event.target.parentElement.tagName === 'A' && event.target.parentElement.href.startsWith('https')) {
        event.preventDefault()
        shell.openExternal(event.target.parentElement.href)
    }
})

document.getElementById('appversion').innerHTML = app.getVersion();
document.getElementById('electronversion').innerHTML = process.versions.electron;