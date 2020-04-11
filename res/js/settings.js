import {MDCDialog} from '@material/dialog';

import {
    MDCRipple
} from '@material/ripple';

const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));

const successdialog = new MDCDialog(document.getElementById('success'));
const faildialog = new MDCDialog(document.getElementById('fail'));

// Open a connection
var socket = new WebSocket('ws://localhost:9999/');

// When a connection is made
socket.onopen = function () {
    socket.send('{"settings": "read" }')
}

// When data is received
socket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    if (data.saved == 1) {
        successdialog.open();
        return;
    }
    else if(data.saved == 0) {
        faildialog.open();
        return;
    }
    else {
        for (let prop in data) {
            let name = '<tr><td>'+prop+'</td>'
            let field = '<td><label class="mdc-text-field"> <div class = "mdc-text-field__ripple"> </div> <input class="mdc-text-field__input" type="text" id="' + prop + '" value="' + data[prop] + '"></label></td></tr>'
            document.getElementById('settings').innerHTML += name + field ;
        }
    }
}

// A connection could not be made
socket.onerror = function (event) {
    console.log(event);
}

// A connection was closed
socket.onclose = function (code, reason) {
    console.log(code, reason);
}

// Close the connection when the window is closed
window.addEventListener('beforeunload', function () {
    socket.close();
});

function saveSettings() {
    let nodes = document.querySelectorAll("input[type=text]");
    let data = {"settings": "write", "payload" :{}};
    let key;
    let val;
    for (let i = 0; i < nodes.length; i++) {
        key = nodes[i].id;
        val = nodes[i].value;
        data.payload[key] = val;
    }
    socket.send(JSON.stringify(data));
}