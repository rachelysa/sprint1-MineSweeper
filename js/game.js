
const MINE = '💣';
const MARK = '🧪';
const PLAY = '😷';
const WIN = '🤩';
const LOSE = '🤧';
const LIVE = '🙂';
const HINT = '🔒';


var gGame;
var gLevel;
var gLives;
var gHints;
var gElStatusBtn;
var gBoard;
var gIsHint;
function initGame(event) {
    createGame();
    gLives = [LIVE, LIVE, LIVE];
    gHints = ['<span id="1"onclick="useHint(this)">' + HINT + '</span>', '<span id="2" onclick="useHint(this)">' + HINT + '</span>', '<span id="3" onclick="useHint(this)">' + HINT + '</span>'];
    render__(gLives, 'live');
    render__(gHints, 'hint');
    gIsHint = false;
    gElStatusBtn = document.querySelector('.refresh');
    gElStatusBtn.innerText = PLAY;
    var minesCount;
    var size = (event) ? +event.id : 4
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

    gLevel = (event) ? createLevel(+event.id, minesCount) : createLevel(4, 2);
    gBoard = createBoard(gLevel.SIZE);
    buildBoard();
}

function createLevel(size, mines) {
    level = {
        SIZE: size,
        MINES: mines
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
function render__(arr, classToChange) {
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