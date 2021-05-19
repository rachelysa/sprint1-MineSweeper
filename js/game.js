
const MINE = '💣';
const FLAG = '🚩';
const PLAY = '😷';
const WIN = '🤩';
const LOSE = '🤧';
const LIVE = '🙂';

var gGame;
var gLevel;
var gLives;
var gElStatusBtn;
var gBoard;
function initGame(event) {
    createGame();
    gLives = [LIVE, LIVE, LIVE];
    render__(gLives, 'live')
    gElStatusBtn = document.querySelector('.refresh');
    gElStatusBtn.innerText = PLAY;
    var minesCount;
    var size=(event)?+event.id:4
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
    
    gLevel = (event) ? createLevel(+event.id,minesCount) :createLevel(4,2);
    gBoard = createBoard(gLevel.SIZE);
    buildBoard();
}
function createLevel(size,mines) {
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
    elToChange.innerText = ''
    for (let i = 0; i < arr.length; i++) {

        elToChange.innerText += arr[i]
    }

}
function checkGameOver(){
    
}