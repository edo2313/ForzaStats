//Aux functions to do nice things with data

function capToZero(val) {
    return val < 0 ? 0 : val;
}

function convertCarClass(num) {
    let classes = ['D','C','B','A','S1','S2','X'];
    return classes[num];
}

function convertDrivetrain(num) {
    let types = ['FWD','RWD','4WD'];
    return types[num];
}

function resetMax(){
    document.getElementById('speedmax').innerHTML = '';
    document.getElementById('powerhpmax').innerHTML = '';
    document.getElementById('powerkwmax').innerHTML = '';
    document.getElementById('enginerpmmax').innerHTML = '';    
}

//Calculate the current season and when the next starts. Taken from this great website https://whatseasonisitinhorizon.com/ with permission of course

let lastCheckedSeason;
let minuteInterval = 0;
let secondInterval = 0;
const seasons = ["winter", "spring", "summer", "autumn"];
const winterStarts = new Date(Date.UTC(2018, 10, 8, 14, 30, 0));

function calculateTimes() {

    let now = new Date();

    // Calculate the number of seasons (weeks) since the seed time.
    let numberOfSeasonsPassed = Math.floor(Math.abs(
        (now - winterStarts) / (7 * 24 * 60 * 60 * 1000)
    ));

    let currentSeason = seasons[numberOfSeasonsPassed % 4];

    // Calculate the next season.
    let nextSeason = seasons[(numberOfSeasonsPassed + 1) % 4];
    let nextSeasonStart = new Date(winterStarts);
    nextSeasonStart.setDate(nextSeasonStart.getDate() + ((numberOfSeasonsPassed + 1) * 7));

    // How much time until the next season.
    let timeTilNextSeason = nextSeasonStart - now;
    let days = Math.floor(timeTilNextSeason / (24 * 60 * 60 * 1000));
    let hours = Math.floor((timeTilNextSeason / (60 * 60 * 1000)) - (days * 24));
    let minutes = Math.floor((timeTilNextSeason / (60 * 1000)) - (hours * 60) - (days * 24 * 60));
    let seconds = Math.floor((timeTilNextSeason / 1000) - (minutes * 60) - (hours * 60 * 60) - (days * 24 * 60 * 60));

    return {
        currentSeason,
        nextSeason,
        days,
        hours,
        minutes,
        seconds
    }
}

function setCountdown(days, hours, minutes, seconds) {

    let str = "";
    // Set all the times
    if (days !== 0)
        str += days + "d ";

    if (hours !== 0 && days !== 0)
        str += hours + "h ";

    if (minutes !== 0 && hours !== 0 && days !== 0)
        str += minutes + "m ";

    // Pad the seconds to two digits

    str += ((seconds > 9) ? seconds : ("0" + seconds))+ "s";

    document.getElementById("nextseasoncountdown").innerHTML = str;
}

function updateTimes() {
    let times = calculateTimes();

    // Check if the season has changed or not
    if (times.currentSeason !== lastCheckedSeason) {
        document.getElementById("currseason").innerHTML = times.currentSeason.charAt(0).toUpperCase() + times.currentSeason.slice(1);
        lastCheckedSeason = times.currentSeason;
    }

    // Configure the countdown timer
    setCountdown(times.days, times.hours, times.minutes, times.seconds);

    if (!secondInterval) {
        clearInterval(minuteInterval);
        secondInterval = setInterval(() => updateTimes(), 1000);
    }
}

updateTimes();

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
        document.getElementById('cardetails').innerHTML = 'ID: ' + data.carOrdinal + '   Class: ' + convertCarClass(data.carClass) + '-' + data.carPerformanceIndex + '   Drivetrain: ' + convertDrivetrain(data.drivetrainType);
        document.getElementById('gear').innerHTML = data.gear == 0 ? 'R' : data.gear;
        document.getElementById('speedmax').innerHTML = Math.max(document.getElementById('speedmax').innerHTML, (data.speed * 3.6).toFixed(1));
        document.getElementById('speed').innerHTML = (data.speed * 3.6).toFixed(1);
        document.getElementById('powerhpmax').innerHTML = Math.max(document.getElementById('powerhpmax').innerHTML, capToZero((data.power / 1000 * 1.34102).toFixed(1)));
        document.getElementById('powerhp').innerHTML = capToZero((data.power / 1000 * 1.34102).toFixed(1));
        document.getElementById('powerkwmax').innerHTML = Math.max(document.getElementById('powerkwmax').innerHTML, capToZero((data.power / 1000).toFixed(1)));
        document.getElementById('powerkw').innerHTML = capToZero((data.power / 1000).toFixed(1));
        document.getElementById('enginerpmmax').innerHTML = Math.max(document.getElementById('enginerpmmax').innerHTML, data.currentEngineRpm.toFixed(0));
        document.getElementById('enginerpm').innerHTML = data.currentEngineRpm.toFixed(0) + '/' + data.engineMaxRpm.toFixed(0);
    } else {
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

var Chart = require('chart.js');
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});