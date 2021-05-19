
'use strict';
var gMinesCount
function createCellInBoard(isMine, nebsCount,) {
    var cell = {
        minesAroundCount: nebsCount,
        isShown: false,
        isMine: isMine,
        isMarked: false,
    }
    return cell;
}

function createBoard(boardSize) {
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCellInBoard(false, 0);

        }

    }

    return board;
}

function buildBoard(i, j) { 
    
    
    if (gIsByYourself) {

        gMinesCount = 0;
        return;
    }

    else setMines(i, j);
    setNegsCount();
    printNebsCount(gLevel.SIZE);
    renderBoard(gBoard);
}

function setMines(i, j) {

    for (let ind = 0; ind < gLevel.MINES; ind++) {
        var idi = getRandomIntInt(0, gLevel.SIZE);
        var idj = getRandomIntInt(0, gLevel.SIZE);

        if (idi === i && idj === j || gBoard[idi][idj].isMine) {
            ind--;
            continue;
        }
        gBoard[idi][idj].isMine = true;

    }

}

function setMinesNegsCount(pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === pos.i && j === pos.j) continue;
            if (gBoard[i][j].isMine) count++;
        }
    }
    return count;

}
function setNegsCount(){
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].minesAroundCount === 0) {
                gBoard[i][j].minesAroundCount = setMinesNegsCount({ i: i, j: j });

            }

        }

    }

}

function showTheHidden(event, i, j) {
    if (gIsByYourself) {
     
        if (gMinesCount !==gLevel.MINES){
           gBoard[i][j].isMine=true
            renderAndUpdateCell({ i: i, j: j }, MINE, false, false,);
            gMinesCount++;
            
        }else{
         
            setNegsCount();
            renderBoard(gBoard);
            gIsByYourself=false;

        }
    } else {
        if (gIsHint === true) { showHint({ i: i, j: j }); return }
        if (gBoard[i][j].isShown) return;
        if (event.button == 2) {

            if (gBoard[i][j].isMine) {

                gGame.markedCount++;
                checkGameOver();
            };

            renderAndUpdateCell({ i: i, j: j }, MARK, false, true)
            return;
        }

        else if (gBoard[i][j].isMarked) {

            if (gBoard[i][j].isMine) gGame[i][j].markedCount--;
            renderAndUpdateCell({ i: i, j: j }, '',)
            return;
        }

        else if (gBoard[i][j].isMine) {

            renderAndUpdateCell({ i: i, j: j }, MINE, true, false, 'show-mine');
            gLives.splice(0, 1);
            renderFicher(gLives, 'live');
            if (gLives.length === 0) {
                gElStatusBtn.innerText = LOSE;
                GameOver(false);
                showAllMines();
                return;
            }
            checkGameOver();
            return;
        }



        else if (gBoard[i][j].minesAroundCount !== 0) {

            renderAndUpdateCell({ i: i, j: j }, gBoard[i][j].minesAroundCount, true, false, 'show');
            gGame.shownCount++;
            checkGameOver()
            return
        }
        else {
            renderAndUpdateCell({ i: i, j: j }, '', true, false, 'show');
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            checkGameOver();
            for (var idi = i - 1; idi <= i + 1; idi++) {
                if (idi < 0 || idi > gBoard.length - 1) continue;
                for (var idj = j - 1; idj <= j + 1; idj++) {
                    if (idj < 0 || idj > gBoard[0].length - 1) continue;
                    if (gBoard[idi][idj].isShown) { continue };
                    showTheHidden(event, idi, idj);
                }
            }
        }
    }
}

function cellClicked(event, i, j) {
    if (gGame.isOn) {
        if (!gTimerInterval) {
            timer();
            buildBoard(i, j)
        }

        gGameFlow.push(JSON.parse(JSON.stringify(gBoard)));
        showTheHidden(event, i, j);
    }

}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isShown)
                renderAndUpdateCell({ i: i, j: j }, MINE, true, false, 'show-mine');
        }

    }
}
function showHint(pos) {

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;

            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMine) renderAndUpdateCell({ i: i, j: j }, MINE, false, true, 'show');
            else if (gBoard[i][j].minesAroundCount != 0)
                renderAndUpdateCell({ i: i, j: j }, gBoard[i][j].minesAroundCount, false, true, 'show')
            else renderAndUpdateCell({ i: i, j: j }, '', false, true, 'show')
        }
    }
    setTimeout(() => {
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue;
            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue;
                if (gBoard[i][j].isShown) continue;

                renderAndUpdateCell({ i: i, j: j }, '', false, true, 'show');
            }
        }
        gIsHint = false;
        gHints.splice(0, 1);
        renderFicher(gHints, 'hint');
    }, 1000);
}

function ShowSafeClick() {
    var safeClickes = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue;
            safeClickes.push({ i: i, j: j });

        }

    }
    var safeClickToShow = safeClickes[getRandomIntInt(0, safeClickes.length)];
    var elCell = document.querySelector(`.cell${safeClickToShow.i}-${safeClickToShow.j}`);
    elCell.classList.toggle('show');
    setTimeout(() => {
        elCell.classList.toggle('show');
        gSafeClick.splice(0, 1);
        renderFicher(gSafeClick, 'safe-click');
    }, 1000);
}

function goBack() {
    if (gGame.isOn) {
        gBoard = gGameFlow.pop();

        renderBoard(gBoard)
    }
}