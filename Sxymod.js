// ==UserScript==
// @name        Fancy sxymod
// @namespace    -
// @version     -
// @description -
// @author       -
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
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
    var ID_BloodThirster = 21;
    var unequip = 16;
    var ID_SamuraiArmor = 20;
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

var counterBox = 0;
var counterWhatsPoppin = 0;
var counterShutUpKid = 0;
var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 230;
var talkSpeed = 1000;
var primary;
var testDir;
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
var msgpack5 = msgpack;
var boostDir;
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
let fastSpeed = 0;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
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

          if (isEnemyNear == true && healToggle == 2){ //Within range instakill
               doNewSend(["6", [4]]);
               doNewSend(["6", [15]]);
              healToggle = 1;
            document.title = "normal heal"
       // doNewSend(["ch", [(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2))).toString()]])

        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 19, 1]]);
        doNewSend(["c", [1]]);
        setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
        }, 93);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 20, 0]]);
            autoaim = false;
        }, instaSpeed);
    }

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
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 190) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 19
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
	        normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {

        if(data[2] < 80 && data[2] > 0 && healToggle == 1) {
            if (data[2] < 56 && data[2] > 0) {
                setTimeout( () => {
                place(foodType, null);
            }, 20);
            }
            setTimeout( () => {
                place(foodType, null);
            }, 90);

        }
         if(data[2] < 54 && data[2] > 0 && healToggle == 2) {
             setTimeout( () => {
                place(foodType, null);
            }, 20);

        }
    }
    update();
}

let speechArray = ["rip kyoko ;c", "kyoko died ;c", "fly high kyoko ;c", "kyoko's dead ;c", "kyoko, you will be missed ;c", "kyoko is gone ;c", "kyoko died ;c", "kyoko died ;c" ];

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
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(mineType, boostDir + toRad(90));
    place(mineType, boostDir - toRad(90));
    place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
}
function threeMill(){
    testDir = myPlayer.dir;
 place(millType, testDir + toRad(90));
        place(millType, testDir - toRad(90));
        place(millType, testDir);
    testDir = myPlayer.dir;
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

const healer = repeater(51, () => {place(foodType)}, 0);
const boostPlacer = repeater(55, () => {place(boostType)
                                       place(boostType)
                                       place(boostType)}, 0);
const millPlacer = repeater(7458, threeMill, 0); //set key when screwing around
const minePlacer = repeater(72, () => {place(mineType)}, 0);
const boostSpiker = repeater(71, boostSpike, 0);
const spikePlacer = repeater(53, () => {place(spikeType)
                                       place(spikeType)
                                       place(spikeType)}, 0);

document.addEventListener('keydown', (e)=>{
    healer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    boostSpiker.start(e.keyCode);
    millPlacer.start(e.keyCode);
    minePlacer.start(e.keyCode);
    spikePlacer.start(e.keyCode);

    if(e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox')
    {
    testDir = myPlayer.dir;
        place(millType, testDir);
        testDir = myPlayer.dir;
 place(millType, testDir + toRad(80));
        testDir = myPlayer.dir;
        place(millType, testDir - toRad(80));

    
}

    if(e.keyCode == 7235 && document.activeElement.id.toLowerCase() !== 'chatbox') {
             autoaim = true;
            doNewSend(["6", [5]]);
            doNewSend(["6", [17]]);
            doNewSend(["6", [31]]);
            doNewSend(["6", [23]]);
            doNewSend(["6", [9]]);
            doNewSend(["6", [38]]);
            setTimeout( () => {
        doNewSend(["5", [secondary, true]]);
        doNewSend(["6", [13]]);
        doNewSend(["13c", [0, 53, 0]]);
        doNewSend(["c", [1]]);
      }, 250);
        setTimeout( () => {
            doNewSend(["13c", [0, 10, 0]]);
            doNewSend(["6", [12]]);

        }, 350);

        setTimeout( () => {
            doNewSend(["6", [15]]);

        }, 450);

        setTimeout( () => {
            doNewSend(["c", [0]]);
            doNewSend(["5", [primary, true]]);
            autoaim = false;
        }, 550);
    }

   // if(e.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') {
   //    arr = ["1,","2","3","4"];
  //     let index = 0;
   //    setInterval( () => {
    //        doNewSend(["ch", [arr[index++]], index = index % arr.length], talkSpeed);}
//
     //  } //Testing autochat


    if(e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
       // autoaim = true;
     //   doNewSend(["5", [secondary, true]]);
        doNewSend(["c", [1]]);

        setTimeout( () => {
            doNewSend(["6", [12]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["6", [13]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["c", [0]]);
         //   doNewSend(["13c", [0, 6, 0]]);
        //    doNewSend(["5", [primary, true]]);
         //   autoaim = false;
        }, 300);
    }
    if(e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
       
            doNewSend(["6", [25]]);
       
    }


    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(mineType, myPlayer.dir + toRad(45));
        place(mineType, myPlayer.dir - toRad(45));
    }
    if (e.keyCode == 53 && document.activeElement.id.toLowerCase() !== 'chatbox') {
             place(spikeType)
        }

    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {

        doNewSend(["ch", [speechArray[Math.floor(Math.random() * 8)]]])
        healToggle = 0;
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 19, 1]]);
        doNewSend(["c", [1]]);
        setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
        }, 100);

        setTimeout( () => {
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 20, 0]]);
            autoaim = false;
            healToggle = 1;
            document.title = "normal heal"
        }, instaSpeed);

    }


    if(e.keyCode == 86 && document.activeElement.id.toLowerCase() !== 'chatbox') { //v for ageup: working on accuracy
        //autoaim = true;
        //doNewSend(["5", [primary, true]]);
        //doNewSend(["13c", [0, 7, 0]]);
        //doNewSend(["13c", [0, 0, 1]]);
        //doNewSend(["13c", [0, 18, 1]]);
       // doNewSend(["c", [1]]);
        //setTimeout( () => {
            doNewSend(["6", "4"]);
        //}, instaSpeed - 150);
        //setTimeout( () => {
          //  doNewSend(["13c", [0, 53, 0]]);
          //  doNewSend(["5", [primary, true]]);
          //  doNewSend(["c", [0, null]]);
          //  doNewSend(["13c", [0, 11, 1]]);
           // autoaim = false;
      //  }, instaSpeed - 100);
          // doNewSend(["ch", [" "]]);
    }

	//hat macros: doesn't trigger when chat is open
     if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 6, 0]]);

    }
    if (e.keyCode == 48 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 40, 0]]);
        doNewSend(["13c", [0, 21, 1]]);
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 53, 0]]);
    }
    if (e.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 26, 0]]);
        doNewSend(["13c", [0, 19, 1]]);
    }
    if (e.keyCode == 57 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 55, 0]]);
    }
    if (e.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["13c", [0, 11, 0]]);
        doNewSend(["13c", [0, 21, 1]]);
    }

    if(e.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') { //p for boost and monk
            doNewSend(["13c", [0, 12, 0]]);
            doNewSend(["13c", [0, 11, 1]]);
    }

       if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {

           doNewSend(["5", [primary, true]]);
         doNewSend(["13c", [0, 0, 1]]);
         doNewSend(["13c", [0, 18, 1]]);
         doNewSend(["13c", [0, 7, 0]]);
    }
    if(e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 4;
    }

    if(e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 3;
        if(healToggle == 0) {
            document.title = "no heal"
            }
         else if (healToggle == 1) {
             document.title = "normal heal"

            }
         else if (healToggle == 2){
             document.title = "guard"
        }
    }
    if(e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        

        
            doNewSend(["6", [15]]);
        
    }

    if(e.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
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
    minePlacer.stop(e.keyCode);
    healer.stop(e.keyCode);
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


document.title = "f"

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


