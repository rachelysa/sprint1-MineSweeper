'use strict';

const MINE = '<img src="./more/MINE.gif" class="mine">';
const MARK = '🧪';
const PLAY = '🙂';
const WIN = '🤩';
const LOSE = '🤧';
const LIVE = '❤️';
const HINT = '🔒';
const SAFECLICK = '👀'

var gGame;
var gLevel;
var gLives;
var gHints;
var gSafeClick;
var gElStatusBtn;
var gBoard;
var gIsHint;
var gTimerInterval;
var gElHighScore;
var gGameFlow;
var gIsByYourself;
function initGame(event) {
    var size
    gGameFlow = [];
    createGame();
    if (event) {
        if (event.id==='add-by-yourself') {gIsByYourself = true;size = 4;}
        else size = +event.id
    }
    else size = 4;
    gLevel = createLevel(size);

    gBoard = createBoard(gLevel.SIZE);
    gGameFlow.push(JSON.parse(JSON.stringify(gBoard)));

    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';

    renderBoard(gBoard);

    addFichers();

    clearTimer();
}

function clearTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval = undefined;

    var elTimer = document.querySelector('.timer');
    elTimer.innerText = 0;
}

function addFichers() {
    gLives = [LIVE, LIVE, LIVE];
    gHints = ['<span id="1"onclick="useHint(this)">' + HINT + '</span>', '<span id="2" onclick="useHint(this)">' + HINT + '</span>', '<span id="3" onclick="useHint(this)">' + HINT + '</span>'];
    gSafeClick = ['<span id="1"onclick="ShowSafeClick(this)">' + SAFECLICK + '</span>', '<span id="1"onclick="ShowSafeClick(this)">' + SAFECLICK + '</span>', '<span id="1"onclick="ShowSafeClick(this)">' + SAFECLICK + '</span>']
    renderFicher(gLives, 'live');
    renderFicher(gHints, 'hint');
    renderFicher(gSafeClick, 'safe-click');
    gIsHint = false;
    gElStatusBtn = document.querySelector('.refresh');
    gElStatusBtn.innerText = PLAY;
    gElHighScore = document.querySelector('.high');
    gElHighScore.innerText = localStorage.getItem("highScore");
}

function timer() {
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        gGame.secsPassed++;
        elTimer.innerText = gGame.secsPassed;
    }, 1000);
}

function createLevel(size) {
    var minesCount;
    switch (size) {
        case 4:
            minesCount = 2
            break;
        case 8:
            minesCount = 10
            break;
        case 12:
            minesCount = 30
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

function renderFicher(arr, classToChange) {
    var elToChange = document.querySelector('.' + classToChange);
    elToChange.innerHTML = '';

    for (let i = 0; i < arr.length; i++) {
        elToChange.innerHTML += arr[i]
    }

}
function GameOver(isWin) {

    var lastHigh = localStorage.getItem("highScore");
    if (!lastHigh || lastHigh < gGame.secsPassed) {
        //להציג במסך
        gElHighScore.innerText = gGame.secsPassed
        localStorage.setItem("highScore", gGame.secsPassed);
    }
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    if (isWin) {
        var elH3WnOrLose = elModal.querySelector('h3');
        elH3WnOrLose.innerText = 'you win!!!!!';
    }
    gGame.isOn = false;
    clearTimer();
    setTimeout(function () {
        elModal.style.display = 'none';
    }, 3000)
}

function checkGameOver() {

    var sumShow = gLevel.SIZE * gLevel.SIZE;
    gElStatusBtn.innerText = WIN;
    if (gGame.markedCount + gGame.shownCount + 3 - gLives.length === sumShow) GameOver(true)


}

function useHint(elHint) {
    if (gIsHint) {
        gIsHint = false;
        elHint.innerText = HINT
    }
    else {
        gIsHint = true;
        elHint.innerText = '🔓'
    }


}
