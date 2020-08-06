const { app, BrowserWindow } = require('electron');

if (require('electron-squirrel-startup')) return app.quit(); //Required for squirrel installation
require('update-electron-app')();

const path = require("path");
const config = require('./config.json');

var fs = require('fs');

var WSS = require('ws').Server;
var wss = new WSS({port: 9999});

wss.on('connection', function (socket) {
    console.log('Opened connection');

    socket.on('message', function (message) {
        console.log('Received: ' + message);
        let objMessage = JSON.parse(message);
        if( Object.keys(objMessage)[0] == 'settings'){
            handleSettings(objMessage);
        }
    });
    socket.on('close', function () {
        console.log('Closed Connection');
    });

});

function handleSettings(message) {
    var payload = {"settings": {}};
    if(message.settings == 'read') {
        payload.settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config.json')));
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(payload));
        });
    }
    else if(message.settings == 'write') {
        payload.settings = JSON.stringify(message.payload);
        fs.writeFile(path.resolve(__dirname, './config.json'), payload.settings, 'utf8',
            function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({"saved": 0}));
                });
            }
            console.log("JSON file has been saved.");
            wss.clients.forEach(function each(client) {
                client.send(JSON.stringify({"saved": 1}));
            });
        });
    }
}

function mapData(message) {
    var mapped = {}

    mapped.isRaceOn = message.readInt32LE(0);                   // = 1 when race is on. = 0 when in menus/race stopped
    mapped.timestampMS = message.readUInt32LE(4);               // Can overflow to 0 eventually
    mapped.engineMaxRpm = message.readFloatLE(8);
    mapped.engineIdleRpm = message.readFloatLE(12);
    mapped.currentEngineRpm = message.readFloatLE(16);
    mapped.accelerationX = message.readFloatLE(20);             // In the car's local space; X = right, Y = up, Z = forward
    mapped.accelerationY = message.readFloatLE(24);
    mapped.accelerationZ = message.readFloatLE(28);
    mapped.velocityX = message.readFloatLE(32);                 // In the car's local space; X = right, Y = up, Z = forward
    mapped.velocityY = message.readFloatLE(36);
    mapped.velocityZ = message.readFloatLE(40);
    mapped.angularVelocityX = message.readFloatLE(44);          // In the car's local space; X = pitch, Y = yaw, Z = roll
    mapped.angularVelocityY = message.readFloatLE(48);
    mapped.angularVelocityZ = message.readFloatLE(52);
    mapped.yaw = message.readFloatLE(56);
    mapped.pitch = message.readFloatLE(60);
    mapped.roll = message.readFloatLE(64);
    mapped.normSuspensionTravelFL = message.readFloatLE(68);    // Suspension travel normalized: 0.0f = max stretch; 1.0 = max compression
    mapped.normSuspensionTravelFR = message.readFloatLE(72);
    mapped.normSuspensionTravelRL = message.readFloatLE(76);
    mapped.normSuspensionTravelRR = message.readFloatLE(80);
    mapped.tireSlipRatioFL = message.readFloatLE(84);           // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip
    mapped.tireSlipRatioFR = message.readFloatLE(88);
    mapped.tireSlipRatioRL = message.readFloatLE(92);
    mapped.tireSlipRatioRR = message.readFloatLE(96);
    mapped.wheelRotationSpeedFL = message.readFloatLE(100);     // Wheel rotation speed radians/sec
    mapped.wheelRotationSpeedFR = message.readFloatLE(104);
    mapped.wheelRotationSpeedRL = message.readFloatLE(108);
    mapped.wheelRotationSpeedRR = message.readFloatLE(112);
    mapped.wheelOnRumbleStripFL = message.readFloatLE(116);     // = 1 when wheel is on rumble strip, = 0 when off
    mapped.wheelOnRumbleStripFR = message.readFloatLE(120);
    mapped.wheelOnRumbleStripRL = message.readFloatLE(124);
    mapped.wheelOnRumbleStripRR = message.readFloatLE(128);
    mapped.wheelInPuddleDepthFL = message.readFloatLE(132);     // = from 0 to 1, where 1 is the deepest puddle
    mapped.wheelInPuddleDepthFR = message.readFloatLE(136);
    mapped.wheelInPuddleDepthRL = message.readFloatLE(140);
    mapped.wheelInPuddleDepthRR = message.readFloatLE(144);
    mapped.surfaceRumbleFL = message.readFloatLE(148);          // Non-dimensional surface rumble values passed to controller force feedback
    mapped.surfaceRumbleFR = message.readFloatLE(152);
    mapped.surfaceRumbleRL = message.readFloatLE(156);
    mapped.surfaceRumbleRR = message.readFloatLE(160);
    mapped.tireSlipAngleFL = message.readFloatLE(164);          // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip
    mapped.tireSlipAngleFR = message.readFloatLE(168);
    mapped.tireSlipAngleRL = message.readFloatLE(172);
    mapped.tireSlipAngleRR = message.readFloatLE(176);
    mapped.tireCombinedSlipFL = message.readFloatLE(180);       // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip
    mapped.tireCombinedSlipFR = message.readFloatLE(184);
    mapped.tireCombinedSlipRL = message.readFloatLE(188);
    mapped.tireCombinedSlipRR = message.readFloatLE(192);
    mapped.suspensionTravelMetersFL = message.readFloatLE(196); // Actual suspension travel in meters
    mapped.suspensionTravelMetersFR = message.readFloatLE(200);
    mapped.suspensionTravelMetersRL = message.readFloatLE(204);
    mapped.suspensionTravelMetersRR = message.readFloatLE(208);
    mapped.carOrdinal = message.readInt32LE(212);               // Unique ID of the car make/model
    mapped.carClass = message.readInt32LE(216);                 // Between 0 (D -- worst cars) and 6 (X class -- best cars) inclusive 
    mapped.carPerformanceIndex = message.readInt32LE(220);      // Between 100 (slowest car) and 999 (fastest car) inclusive
    mapped.drivetrainType = message.readInt32LE(224);           // Corresponds to EDrivetrainType; 0 = FWD, 1 = RWD, 2 = AWD
    mapped.numCylinders = message.readInt32LE(228);             // Number of cylinders in the engine

    mapped.positionX = message.readFloatLE(244);                // Position (meters)
    mapped.positionY = message.readFloatLE(248);
    mapped.positionZ = message.readFloatLE(252);
    mapped.speed = message.readFloatLE(256);                    // Meters per second
    mapped.power = message.readFloatLE(260);                    // Watts
    mapped.torque = message.readFloatLE(264);                   // Newton meter
    mapped.tireTempFL = message.readFloatLE(268);
    mapped.tireTempFR = message.readFloatLE(272);
    mapped.tireTempRL = message.readFloatLE(276);
    mapped.tireTempRR = message.readFloatLE(280);
    mapped.boost = message.readFloatLE(284);
    mapped.fuel = message.readFloatLE(288);
    mapped.distanceTraveled = message.readFloatLE(292);
    mapped.bestLap = message.readFloatLE(296);
    mapped.lastLap = message.readFloatLE(300);
    mapped.currentLap = message.readFloatLE(304);
    mapped.currentRaceTime = message.readFloatLE(308);
    mapped.lapNumber = message.readUInt16LE(312);
    mapped.racePosition = message.readUInt8(314);
    mapped.accel = message.readUInt8(315);
    mapped.brake = message.readUInt8(316);
    mapped.clutch = message.readUInt8(317);
    mapped.handbrake = message.readUInt8(318);
    mapped.gear = message.readUInt8(319);
    mapped.steer = message.readUInt8(320);
    mapped.normDrivingLine = message.readUInt8(321);
    mapped.normAIBrakeDiff = message.readUInt8(322);

    return mapped;
}

//UDP Handling

var PORT = config.port;
var HOST = config.address;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

//Open Connection
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

//Handle message
server.on('message', function (message, remote) {
    let data = JSON.stringify(mapData(message));
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
});

server.bind(PORT, HOST);

//UDP End

function createWindow() {
    // Crea la finestra del browser
    let win = new BrowserWindow({
        width: 900,
        height: 700,
        icon: path.resolve(__dirname, './res/img/logo.png'),
        webPreferences: {
            nodeIntegration: true
        }
    })
    // e carica l'index.html dell'app
    win.loadFile(path.resolve(__dirname, './pages/index.html'))
    win.setMenuBarVisibility(false)
}

app.whenReady().then(createWindow)
console.log(process.cwd());