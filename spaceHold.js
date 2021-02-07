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


let mouseX;
let mouseY;

let width;
let height;




let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");



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




function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}


function vlace(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);

}





const p = repeater(32, () => {vlace(spikeType)
                              vlace(spikeType)
                              vlace(spikeType)}, 0);

document.addEventListener('keydown', (e)=>{
    p.start(e.keyCode);
})

document.addEventListener('keyup', (e)=>{
    p.stop(e.keyCode);
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}





