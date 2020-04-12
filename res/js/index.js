function captozero(val) {
    return val < 0 ? 0 : val;
}

function convertCarClass(num) {
    if (num == 0) return 'D';
    if (num == 1) return 'C';
    if (num == 2) return 'B';
    if (num == 3) return 'A';
    if (num == 4) return 'S1';
    if (num == 5) return 'S2';
    if (num == 6) return 'X';

}

// Open a connection
var socket = new WebSocket('ws://localhost:9999/');

// When a connection is made
socket.onopen = function () {
    console.log('Opened connection');
}

// When data is received
socket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    if(data.isRaceOn){
        document.getElementById('paused').innerHTML = '';
        document.getElementById('cardetails').innerHTML = 'ID: ' + data.carOrdinal + '   Class: ' + convertCarClass(data.carClass) + '-' + data.carPerformanceIndex;
        document.getElementById('gear').innerHTML = data.gear == 0 ? 'R' : data.gear;
        document.getElementById('speed').innerHTML = (data.speed * 3.6).toFixed(1);
        document.getElementById('powerhp').innerHTML = captozero((data.power / 1000 * 1.34102).toFixed(1));
        document.getElementById('powerkw').innerHTML = captozero((data.power / 1000).toFixed(1));
        document.getElementById('enginerpm').innerHTML = data.currentEngineRpm.toFixed(0) + '/' + data.engineMaxRpm.toFixed(0);
    }
    else{
        document.getElementById('paused').innerHTML = 'PAUSED!';
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


import {MDCDataTable} from '@material/data-table';
const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));