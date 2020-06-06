var socket = io();
var params = jQuery.deparam(window.location.search);

//When host connects to server
socket.on('connect', function() {

    document.getElementById('players').value = "";
    
    //Tell server that it is host connection
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
});

//Adds player's name to screen and updates player count
socket.on('updatePlayerLobby', function(data){
    
    $players = $('#players');

    for(var i = 0; i < data.length; i++){
        $players.append("<li>"+data[i].name+"</li>");
    }
    
});

//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGame');
}
function endGame(){
    window.location.href = "/";
}

function deleteGame(){
    console.log("delete", $.deparam().id);
    socket.emit('deleteGame', $.deparam().id);
    window.location.href="/create/"
}

//When server starts the game
socket.on('gameStarted', function(id){
    console.log('Game Started!');
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

