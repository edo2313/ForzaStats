function captozero(val) {
    return val < 0 ? 0 : val;
}

// Open a connection
var socket = new WebSocket('ws://localhost:9999/');

// When a connection is made
socket.onopen = function () {
    console.log('Opened connection');
}

// When data is received
socket.onmessage = function (event) {
    data = JSON.parse(event.data);
    document.getElementById('gear').innerHTML = data.gear == 0 ? 'R' : data.gear;
    document.getElementById('speed').innerHTML = (data.speed * 3.6).toFixed(1);
    document.getElementById('powerhp').innerHTML = captozero((data.power / 1000 * 1.34102).toFixed(1));
    document.getElementById('powerkw').innerHTML = captozero((data.power / 1000).toFixed(1));
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
