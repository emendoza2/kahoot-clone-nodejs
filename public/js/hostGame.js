var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

window.h = preact.h;
window.Component = preact.Component;
window.render = preact.render;

var html = htm.bind(h);

var colors = ["#41bbc5", "#fa557a", "#6bdd8c", "#f764de", "#72df19", "#d592eb", "#8dbcf9", "#90a65d"];

var timer;

var time = 20;

var leaderboard = [];

//When host connects to server
socket.on('connect', function() {
    
    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data){
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    var correctAnswer = data.correct;
    document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();
});

socket.on('updatePlayersAnswered', function(data){
   document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame; 
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    var answers = [];
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    
    //Shows user correct answer with effects on elements
    for (var c = 1; c <= 4; c ++) {
        if (c === correct) {
            var a = document.getElementById('answer'+c);
            a.innerHTML = "&#10004" + a.innerHTML;
            document.querySelector("#square" + c + " + .squareLabel").innerHTML = "&#10004";
        }
        else {
            document.getElementById("answer" + c).style.filter = "grayscale(40%)";
        }
    }
    
    for(var i = 0; i < playerData.length; i++){
        answer[playerData[i].gameData.answer] = answer[playerData[i].gameData.answer] || 0
        answer[playerData[i].gameData.answer] += 1;
        total += 1;   
    }
    
    //Gets values for graph
    answer1 = answer1 / total * 100 + 16;
    answer2 = answer2 / total * 100 + 16;
    answer3 = answer3 / total * 100 + 16;
    answer4 = answer4 / total * 100 + 16;
    
    document.getElementById('square1').style.height = answer1 + "px";
    document.getElementById('square2').style.height = answer2 + "px";
    document.getElementById('square3').style.height = answer3 + "px";
    document.getElementById('square4').style.height = answer4 + "px";
    
    document.getElementById('nextQButton').style.display = "block";

    leaderboard = playerData.sort(function(a, b) {
        return a.gameData.score - b.gameData.score;
    }).slice(0, 4);
    
    setTimeout(function() {
        $('#qa').hide();
        $('#leaderboard').show();
        for (var i = 0; i < leaderboard.length; i ++) {
            leaderboard.append("<li>"+leaderboard[i].gameData.score+"</li>");
        }
    }, 1000)

});

function nextQuestion(){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.filter = "none";
    document.getElementById('answer2').style.filter = "none";
    document.getElementById('answer3').style.filter = "none";
    document.getElementById('answer4').style.filter = "none";
    
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = " 20";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer(){
    time = 20;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time == 0){
            socket.emit('timeUp');
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').innerHTML = "GAME OVER";
    document.getElementById('playersAnswered').innerHTML = "";
    
    
    
    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "block";
    document.getElementById('winner5').style.display = "block";
    document.getElementById('winnerTitle').style.display = "block";
    
    document.getElementById('winner1').innerHTML = "1. " + data.num1;
    document.getElementById('winner2').innerHTML = "2. " + data.num2;
    document.getElementById('winner3').innerHTML = "3. " + data.num3;
    document.getElementById('winner4').innerHTML = "4. " + data.num4; 
    document.getElementById('winner5').innerHTML = "5. " + data.num5;
});



socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});

var app = html`<main><h4 id="questionNum">Question 1 / x</h4>
<h4 id="playersAnswered">Players Answered: 0 / x</h4>
<h3 id="timerText">Time Left:<span id="num"> 20</span></h3>

<div class="bar">
    <div class="square" id="square1"></div>
    <div class="squareLabel"></div>
</div>
<div class="bar">
    <div class="square" id="square2"></div>
    <div class="squareLabel"></div>
</div>
<div class="bar">
    <div class="square" id="square3"></div>
    <div class="squareLabel"></div>
</div>
<div class="bar">
    <div class="square" id="square4"></div>
    <div class="squareLabel"></div>
</div>

<div id="qa">
    <h2 id="question">Question</h2>
    <h3 class="answer answer1">
        <svg style="display: inline; vertical-align: middle; margin-right: 1em;" viewBox="-24 -24 48 48"
            width="2rem">
            <polygon points="0,-24 20.785,12 -20.785,12 " fill="#FFF" /></svg>
        <span id="answer1">Answer</span>
    </h3>
    <h3 class="answer answer2">
        <svg style="display: inline; vertical-align: middle; margin-right: 1em;" viewBox="0 0 24 24"
            width="2rem">
            <rect x="2" y="2" width="18" height="18" fill="#FFF" /></svg>
        <span id="answer2">Answer</span>
    </h3>
    <h3 class="answer answer3">
        <svg style="display: inline; vertical-align: middle; margin-right: 1em;" viewBox="-24 -24 48 48"
            width="2rem">
            <circle cx="0" r="22" fill="#FFF" /></svg>
        <span id="answer3">Answer</span>
    </h3>
    <h3 class="answer answer4">
        <svg style="display: inline; vertical-align: middle; margin-right: 1em;" viewBox="-24 -24 48 48"
            width="2rem">
            <polygon points="24,0 12,20.785 -12,20.785 -24,0 -12,-20.785 12,-20.785 " fill="#FFF" /></svg>
        <span id="answer4">Answer</span>
    </h3>
</div>
<div id="leaderboard">
    <ol>
        <li>Elijah</li>
        <li>Eda</li>
        <li>Titu</li>
    </ol>
</div>
<br>
<button onclick="nextQuestion()" id="nextQButton">Next Question</button>

<h2 id="winnerTitle">Top 5 Players</h4>
    <h3 id="winner1">1.</h3>
    <h3 id="winner2">2.</h3>
    <h3 id="winner3">3.</h3>
    <h3 id="winner4">4.</h3>
    <h3 id="winner5">5.</h3></main>`

render(app, document.getElementById("app"));