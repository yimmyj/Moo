// ==UserScript==
// @name        Anti Space-scroll
// @namespace    -
// @version     1.4
// @description bitch
// @author       MrSexy#8888
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://spurious-butter-wineberry.glitch.me/*
// @grant    GM_addStyle
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// ==/UserScript==

(function() {
    'use strict';

    var ID_TankGear = 40;
    var ID_SoldierHelmet = 6;
    var ID_BullsHelmet = 7;
    var ID_TurretGear = 53;
    var ID_BoostHelmet = 12;
    var ID_SpikeGear = 11;
    var ID_BloodThirster = 55;
    var unequip = 16;
    var ID_SamuraiArmor = 21;
    var ID_BarbarianArmor = 26;

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
        }
    });

})();

let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
    if(messageToggle == 1) {
        doNewSend(["ch", [animate(true, 5)]])
    }
}, 200);

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);

setInterval(() => {
    if(hatToggle == 1) {
        if(oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y){
     var cvs = document.getElementById("gameCanvas");
     cvs.dispatchEvent(new MouseEvent("mousemove", {
         clientX: x,
         clientY: y

     }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 230;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var counterBox;
var msgpack5 = msgpack;
var boostDir;
var spikeDir;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};

let healSpeed = 90;
let fastSpeed = 50;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let wrToggle = 0;
let hatToggle = 0;

document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
     this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};


function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function handleMessage(m){
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
      data = temp;
    }
    let item = data[0];
    if(!data) {return};


    if(item === "io-init") {
            let cvs = document.getElementById("gameCanvas");
            width = cvs.clientWidth;
            height = cvs.clientHeight;
            $(window).resize(function() {
                width = cvs.clientWidth;
                height = cvs.clientHeight;
            });
            cvs.addEventListener("mousemove", e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }

    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }

    if (item == "33") {
        enemiesNear = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }

    isEnemyNear = false;
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }

    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 140) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 19
                }
            };
        }
    }
    if (isEnemyNear == true && healToggle == 1){
              autoaim = true;
        healToggle = 2;
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["5", [primary, true]]);
        doNewSend(["c", [1]]);
      setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);

        spikeDir = nearestEnemyAngle;

            place(spikeType, spikeDir);

        }, 90);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            autoaim = false;
            doNewSend(["5", [primary, true]]);
        }, instaSpeed);
    }

    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 80 && data[2] > 0 && healToggle == 1) {
            setTimeout( () => {
                place(foodType, null);
            }, 70);

        }
         if(data[2] < 54 && data[2] > 0 && healToggle == 2) {
            setTimeout( () => {
                place(foodType, null);
            }, fastSpeed);

        }
    }
    update();
}


function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}


function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function vlace(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);

}

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
}

function katSpikeInsta() {

        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["c", [1]]);
      setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
          if(spikeDir == null) {
        spikeDir = nearestEnemyAngle;
    }
            place(spikeType, spikeDir);

        }, 80);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            autoaim = false;
            doNewSend(["5", [primary, true]]);
        }, instaSpeed);

}


var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if(_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if(!_isKeyDown){
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };


}

const healer = repeater(7998897, () => {place(foodType)}, 0);
const boostPlacer = repeater(70, () => {place(boostType)
                                       place(boostType)
                                       place(boostType)}, 0);
const millPlacer = repeater(78, () => {place(millType)
                                      place(millType)}, 0);
const turretPlacer = repeater(778782, () => {place(turretType)}, 0);
const boostSpiker = repeater(71, boostSpike, 0);
const spikePlacer = repeater(86, () => {
    place(spikeType)
    place(spikeType)
place(spikeType)}, 0);
const p = repeater(32, () => {vlace(spikeType)
                              vlace(spikeType)
                              vlace(spikeType)}, 0);

document.addEventListener('keydown', (e)=>{
    healer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    boostSpiker.start(e.keyCode);
    millPlacer.start(e.keyCode);
    turretPlacer.start(e.keyCode);
    spikePlacer.start(e.keyCode);
    p.start(e.keyCode);

    if(e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
       autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["c", [1]]);
      setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);

        spikeDir = nearestEnemyAngle;

            place(spikeType, spikeDir);

        }, 90);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            autoaim = false;
            doNewSend(["5", [primary, true]]);
        }, instaSpeed);
    }
    if (e.keyCode == 67 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", "4"]);
    }

    if (e.keyCode == 765783 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(boostType, angle)
        }
    }
    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir);
    }





    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 6, 0]]);
    }
    if (e.keyCode == 48 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 40, 0]]);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 7, 0]]);
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 53, 0]]);
    }
    if (e.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 26, 0]]);
    }
    if (e.keyCode == 57 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 55, 0]]);
    }
    if (e.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 12, 0]]);
    }
    if (e.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 21, 0]]);
    }
    if (e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 16, 0]]);
    }









    if (e.keyCode == 86 && document.activeElement.id.toLowerCase() !== 'chatbox') {
             place(spikeType)
        }

        if(e.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["c", [1]]);
      setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
        }, 90);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            autoaim = false;
            
        }, instaSpeed);
    }
    


    if(e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        wrToggle = (wrToggle + 1) % 2;
        if (wrToggle == 0){
        if(healToggle == 0) {
            document.title = "off || off"
            }
         else if (healToggle == 1) {
             document.title = "off || h"

            }
         else if (healToggle == 2){
             document.title = "off || sh"
        }
      }

        else if (wrToggle == 1){
        if(healToggle == 0) {
            document.title = "on || off"
            }
         else if (healToggle == 1) {
             document.title = "on || h"

            }
         else if (healToggle == 2){
             document.title = "on || sh"
        }
    }
    }
    if(e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 3;
      if (wrToggle == 0){
        if(healToggle == 0) {
            document.title = "off || off"
            }
         else if (healToggle == 1) {
             document.title = "off || h"

            }
         else if (healToggle == 2){
             document.title = "off || sh"
        }
      }

        else if (wrToggle == 1){
        if(healToggle == 0) {
            document.title = "on || off"
            }
         else if (healToggle == 1) {
             document.title = "on || h"

            }
         else if (healToggle == 2){
             document.title = "on || sh"
        }
      }
    }
    if(e.keyCode == 70094 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [secondary, true]]);
        doNewSend(["13c", [0, 53, 0]]);
        doNewSend(["c", [1]]);

        setTimeout( () => {
            doNewSend(["6", [12]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["6", [15]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["c", [0]]);
            doNewSend(["13c", [0, 6, 0]]);
            doNewSend(["5", [primary, true]]);
            autoaim = false;
        }, 300);
    }

    if(e.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
        doNewSend(["6", [25]]);
    }
})

document.addEventListener('keyup', (e)=>{
    spikePlacer.stop(e.keyCode);
    boostPlacer.stop(e.keyCode);
    boostSpiker.stop(e.keyCode);
    millPlacer.stop(e.keyCode);
    turretPlacer.stop(e.keyCode);
    healer.stop(e.keyCode);
    p.stop(e.keyCode);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 10);
    }
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}


document.title = "Heal: ON | Hat: ON"

function update() {
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }

    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }

    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }

    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }

    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }

    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }

    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }

    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }

    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }

    spawnpadType = 36;
}


