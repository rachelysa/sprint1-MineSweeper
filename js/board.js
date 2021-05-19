

function createCellInBoard(isMine, nebsCount) {
    var cell = {
        minesAroundCount: nebsCount,
        isShown: false,
        isMine: isMine,
        isMarked: false,
    }
    return cell;
}
function buildBoard() {

    setMines();
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j] === '') {
                var nebsCount = setMinesNegsCount({ i: i, j: j });
                gBoard[i][j] = createCellInBoard(false, nebsCount)
            }

        }

    }
    printNebsCount(gLevel.SIZE);
    renderBoard(gBoard);
}

function setMines() {

    for (let i = 0; i < gLevel.MINES; i++) {
        var idi = getRandomIntInt(0, gLevel.SIZE);
        var idj = getRandomIntInt(0, gLevel.SIZE);
        gBoard[idi][idj] = createCellInBoard(true, 0);

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
function cellClicked(event, i, j) {
    if(gGame.secsPassed===0)  timer();
    if (gIsHint === true) { showHint({ i: i, j: j }); return }

    console.log(gBoard[i][j]);
    debugger
    if (event.button == 2) {
        if (gBoard[i][j].isMine) {
            gGame.markedCount++;
            checkGameOver();
        };

        renderAndUpdateCell({ i: i, j: j }, MARK, false, true)
        return;
    }
    if (gBoard[i][j].isShown) { 
        return; 
    }

    if (gBoard[i][j].isMarked) {
        if (gBoard[i][j].isMine) gGame[i][j].markedCount--;
        renderAndUpdateCell({ i: i, j: j }, '',)
        return;
    }

    if (gBoard[i][j].isMine) {
        if (gLives.length === 1) { gElStatusBtn.innerText = LOSE; clearInterval(gTimerInterval); }
        renderAndUpdateCell({ i: i, j: j }, MINE, true, false, 'show-mine');
        gLives.splice(0, 1);
        renderFicher(gLives, 'live');
        return;
    }

    if (gBoard[i][j].minesAroundCount !== 0) {
        renderAndUpdateCell({ i: i, j: j }, gBoard[i][j].minesAroundCount, true, false, 'show')
        return
    }
    gBoard[i][j].isShown = true;
 
    for (var idi = i - 1; idi <= i + 1; idi++) {
        if (idi < 0 || idi > gBoard.length - 1) continue;
        for (var idj = j - 1; idj <= j + 1; idj++) {
            if (idj < 0 || idj > gBoard[0].length - 1) continue;
            if (idi === i && idj === j) continue;
            renderAndUpdateCell({ i: i, j: j }, '', true, false, 'show');
            gGame.shownCount++;
            checkGameOver();
            cellClicked(event, idi, idj);

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