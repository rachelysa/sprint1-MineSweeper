'use strict';

function renderBoard(mat) {

  var strHTML = '';
  var cell;
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell='';
    if(mat[i][j].isShown){

       cell=(mat[i][j].minesAroundCount)?mat[i][j].minesAroundCount:'';
       if(mat[i][j].isShown&&mat[i][j].isMine)cell=MINE;
    }
      var className = 'cell cell' + i + '-' + j;
      if(mat[i][j].isShown){
        if(mat[i][j].isMine) className+=' show-mine';
        else className+=' show';
      }

      strHTML += '<td class="' + className + ' " onmousedown="cellClicked(event,' + i + ',' + j + ')" oncontextmenu="return false">'+cell+'</td>'
    }
    strHTML += '</tr>'
  }

  var elContainer = document.querySelector('.board');
  elContainer.innerHTML = strHTML;
}

function renderAndUpdateCell(location, value, isShow = false, isMark = false, classToAdd = undefined) {
  // Select the elCell and set the value

  gBoard[location.i][location.j].isShown = isShow;

  gBoard[location.i][location.j].isMarked = isMark;
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
  elCell.classList.toggle(classToAdd);


}

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function printNebsCount(boardSize) {
  var mat = [];
  for (var i = 0; i < boardSize; i++) {
    mat[i] = [];
    for (var j = 0; j < boardSize; j++) {
      if (gBoard[i][j].isMine) mat[i][j] = MINE;
      else mat[i][j] = gBoard[i][j].minesAroundCount;
    }

  }
  console.table(mat);
}
