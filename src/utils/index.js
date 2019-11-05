import * as _ from 'lodash';

function newCell(value, x, y) {
  return {
    value,
    x,
    y,
    coord: [x, y]
  }
}

const newGame = (cells, time) => {
  return {
    cells,
    time: time || new Date(0, 0, 0, 0, 0, 0, 0)
  }
}

const newBoard = (cells, totalCell) => {
  const amount = Math.floor(0.1 * totalCell);
  const playerMushroomsCells = createMushrooms(createPlayer(cells), amount);
  return newGame(playerMushroomsCells, null);
}

const createPlayer = (cells) => {
  const selectedCell = selectRandomCell(cells);
  const playerCell = _.clone(selectedCell);
  playerCell.value = 'player';
  return findAndReplaceCell(cells, playerCell);
}

const getPlayerCell = (cells) => {
  return _.find(_.flattenDeep(cells), cell => cell.value === 'player')
}

const getCellByCoord = (cells, coord) => {
  return _.find(_.flattenDeep(cells), cell => cell.x === coord.x && cell.y === coord.y);
}

const createMushrooms = (cells, amount) => {
  if(!amount) {
    return cells;
  }
  const mushroomCell = selectRandomCell(cells);
  mushroomCell.value = 'mushroom';

  return createMushrooms(findAndReplaceCell(cells, mushroomCell), amount - 1);
}

const selectRandomCell = (cells) => {
  const selectedCell = _.sample(_.flattenDeep(cells));
  if(selectedCell.value) {
    return selectRandomCell(cells);
  }
  return selectedCell;
}

const findAndReplaceCell = (cells, cell) => {
  return cells.map((row, i) => {
    if(getCellInRow(row, i, cell.coord)){
      row[cell.y] = cell;
    }
    return row;
  });
}

const getCellInRow = (row, rowIndex, coord) => {
  if(rowIndex !== coord[0]){
    return null;
  }
  return row.find(cell => cell.y === coord[1]);
}

const arrayToBoard = (iArray, cols, rows) => {
  let array = [];
  for (let i = 0; i < iArray.length; i++) {
    if (iArray[i] === '0') {
      array.push(null);
    } else {
      array.push(Number(iArray[i]));
    }
  }
  array = _.chunk(array, cols);

  let board = []
  for (let i = 0; i < cols; i++) {
    let row = [];
    for (let j = 0; j < rows; j++) {
      row.push(newCell(null, i, j));
    }
    board.push(row);
  }
  return newBoard(board, iArray.length);
}

const getMushroomCells = (cells) => {
  return _.flattenDeep(cells).filter(cell => cell.value === 'mushroom');
}

const Util = { arrayToBoard, getPlayerCell, getCellInRow, findAndReplaceCell, getCellByCoord, getMushroomCells };
export default Util;
