'use strict';

const MINE = '💣';
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

function initGame(event) {
    createGame();

    var size = (event) ? +event.id : 4
    gLevel = createLevel(size);

    gBoard = createBoard(gLevel.SIZE);
    buildBoard();

    addFichers();

    timer();


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
    return level
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
    elToChange.innerHTML = ''
    for (let i = 0; i < arr.length; i++) {

        elToChange.innerHTML += arr[i]
    }

}

function checkGameOver() {

    var sumShow = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if (gGame.markedCount === gLevel.MINES || gGame.shownCount === sumShow) {

        gElStatusBtn.innerText = WIN;
        var lastHigh = localStorage.getItem("highScore");
        if (!lastHigh || lastHigh > gGame.secsPassed) {
            //להציג במסך
            gElHighScore.innerText = gGame.secsPassed
            localStorage.setItem("highScore", gGame.secsPassed);
        }
        debugger
        clearInterval(gTimerInterval);
    }

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
