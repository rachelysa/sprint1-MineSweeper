'use strict';

const MINE = '<img src="./img/MINE.gif" class="mine">';
const MARK = '🧪';
const PLAY = '🙂';
const WIN = '🤩';
const LOSE = '🤧';
const LIVE = '❤️';
const HINT = ' ❕';
const SAFECLICK = '👁‍🗨'



var gGame;
var gLevel;
var gBoard;

var gLives;
var gHints;
var gSafeClick;

var gElStatusBtn;
var gElHighScore;

var gIsByYourself;
var gIsHint;

var gTimerInterval;
var gGameFlow;
var gHighScore;
var gCurrHighScore;

function initGame(event) {
    var levelSize

    gGameFlow = [];

    createGame();

    if (event) {
        if (event.id === 'add-by-yourself') {
            gIsByYourself = true;
            levelSize = 4;
            var elBtnStart = document.querySelector('.start');
            elBtnStart.style.display = 'inline'

        }
        else levelSize = +event.id
    }
    else levelSize = 4;

    gHighScore = JSON.parse(localStorage.getItem("highScore"));
    if (!gHighScore) {
        gHighScore = JSON.stringify({ 'easy': 0, 'hard': 0, 'extreme': 0 })
        localStorage.setItem("highScore", gHighScore);
    }

    gLevel = createLevel(levelSize);
    gBoard = createBoard(gLevel.SIZE);

    gGameFlow.push(JSON.parse(JSON.stringify(gBoard)));

    renderBoard(gBoard);

    addFichers();
    //for restart button
    clearTimer();
}

function createLevel(size) {
    var minesCount;
    switch (size) {
        case 4:
            minesCount = 2;
            gCurrHighScore = gHighScore.easy;
            break;
        case 8:
            minesCount = 10
            gCurrHighScore = gHighScore.hard;
            break;
        case 12:
            minesCount = 30;
            gCurrHighScore = gHighScore.extreme;
            break;

    }

    var level = {
        SIZE: size,
        MINES: minesCount
    };
    return level;
}

function createGame() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}

function addFichers() {
    gLives = [];
    gHints = []
    gSafeClick = [];
    for (let i = 0; i < 3; i++) {
        gLives[i] = LIVE;
        gHints[i] = '<span id="1"onclick="useHint(this)">' + HINT + '</span>';
        gSafeClick[i] = '<span id="1"onclick="ShowAndHideSafeClick(this)">' + SAFECLICK + '</span>';
    }

    renderFicher(gLives, 'live');
    renderFicher(gHints, 'hint');
    renderFicher(gSafeClick, 'safe-click');

    gIsHint = false;

    gElStatusBtn = document.querySelector('.restart');
    gElStatusBtn.innerText = PLAY;

    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';

    gElHighScore = document.querySelector('.high');
    gElHighScore.innerText = gCurrHighScore;


}

function renderFicher(arr, classToChange) {
    var elToChange = document.querySelector('.' + classToChange);
    elToChange.innerHTML = '';

    for (let i = 0; i < arr.length; i++) {
        elToChange.innerHTML += arr[i]
    }

}

function timer() {

    var audio = new Audio('./audio/tick.wav');
    var second = 0;
    var minute = 0;
    var hour = 0
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        gGame.secsPassed++;
        second++;
        if (gGame.secsPassed === 60) { second = 0; minute++ }
        if (minute === 60) { minute = 0; hour++ }
        audio.play();
        elTimer.innerText = hour + ':' + minute + ':' + second;
    }, 1000);
}

function clearTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval = undefined;

    var elTimer = document.querySelector('.timer');
    elTimer.innerText = 0;
}

function GameOver(isWin) {

    //check high score
    if (gCurrHighScore == 0 || gCurrHighScore > gGame.secsPassed && isWin) {

        if (gLevel.SIZE === 4) gHighScore.easy = gGame.secsPassed;
        else if (gLevel.SIZE === 8) gHighScore.hard = gGame.secsPassed;
        else gHighScore.extreme = gGame.secsPassed;
        localStorage.setItem("highScore", JSON.stringify(gHighScore));
        gCurrHighScore = gGame.secsPassed;
        gElHighScore.innerText = gCurrHighScore
    }
    //add the modal
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    var elH3WnOrLose = elModal.querySelector('h3');
    elH3WnOrLose.innerText = (isWin) ? 'you win!!!!!' : 'game ovar...;'
    gElStatusBtn.innerText = (isWin) ? WIN : LOSE;
    setTimeout(function () {
        elModal.style.display = 'none';
    }, 3000)
    //finish the game
    gGame.isOn = false;
    clearTimer();

}

function checkGameOver() {

    var sumShow = gLevel.SIZE * gLevel.SIZE;

    if (gGame.markedCount + gGame.shownCount + 3 - gLives.length === sumShow) GameOver(true)


}

function useHint(elHint) {
    if (gIsHint) {
        gIsHint = false;
        elHint.innerText = HINT
    }
    else {
        gIsHint = true;
        elHint.innerText = '❗️'
    }


}
