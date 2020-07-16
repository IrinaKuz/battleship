const my_board = document.querySelector('#my_board');
const comp_board = document.querySelector('#comp_board');
const start_game = document.querySelector('#start_game');
const comp_gameboardEl = document.querySelector('.comp_gameboard');
let cells_comp = [];

let my_gameboard = new Gameboard();
let comp_gameboard = new Gameboard();
my_gameboard.chooseRandomShips();
comp_gameboard.chooseRandomShips();
let user = new Player('user', my_gameboard, new Gameboard());
let computer = new Player('computer', comp_gameboard, new Gameboard());

async function drawBoards() {
  await user.op_gameboard.drawBoard(comp_board);
  cells_comp = comp_board.querySelectorAll('.cell');
}

function loop(coord) {
      let result = computer.my_gameboard.receiveAttack(coord);
      user.op_gameboard.updateOpponentBoard(coord, result);
      if(result == 'lost') {
        user.op_gameboard.endGame('You won!');
      }
      // redraw computer's board
      user.op_gameboard.renderBoard(comp_board);
      let comp_coord = computer.makeMove();
      result = user.my_gameboard.receiveAttack(comp_coord);
      user.op_gameboard.renderBoard(comp_board);
      if(result == 'lost') {
        user.op_gameboard.endGame('You lost!');
      }
      // redraw user's board
      user.my_gameboard.renderBoard(my_board);
}

function getCoords(e) {
  const cell = this;
  const top = parseInt(cell.style.top, 10);
  const left = parseInt(cell.style.left, 10);
  const x = left /  my_gameboard.cellWidth;
  const y = top /  my_gameboard.cellWidth;
  coord = {x: x, y: y};
  loop(coord);
}

async function addCellListeners() {
  await drawBoards();
  for (let i = 0; i < cells_comp.length; i++) {
    cells_comp[i].addEventListener('click', getCoords);
  }
}

function onChooseShip(e) {
  e.preventDefault();
  const boardRect = my_board.getBoundingClientRect();
  const left = boardRect.x;
  const top = boardRect.y;
  let coordX = e.clientX - left;
  let coordY = e.clientY - top;
  const cellInd = my_gameboard.getCellIndex(coordX, coordY);
  const isShip = my_gameboard.getShip(cellInd);
  if (isShip) {
    const cellX = Math.floor(coordX / my_gameboard.cellWidth);
    const cellY = Math.floor(coordY / my_gameboard.cellWidth);
    my_gameboard.activeShipInd = my_gameboard.findShip(cellX, cellY);
    my_gameboard.shipActive = true;
    const shipC = my_gameboard.ships[my_gameboard.activeShipInd].coords;
    my_gameboard.updateShipCells('active');
    my_gameboard.renderBoard(my_board);
    my_gameboard.onMoveShip = () => {
      function moveShip(e) {
        let leftC, topC;
        const boardRect = my_board.getBoundingClientRect();
        const left = boardRect.x;
        const top = boardRect.y;
        leftC = e.clientX - left;
        topC = e.clientY - top;

        const shipCoordX = Math.floor(leftC / my_gameboard.cellWidth);
        const shipCoordY = Math.floor(topC / my_gameboard.cellWidth);
        const shipLength = my_gameboard.ships[my_gameboard.activeShipInd].length;
        const shipVertical = my_gameboard.ships[my_gameboard.activeShipInd].vertical;
        const coordShort = my_gameboard.makeShipCoordsShort(shipCoordX, shipCoordY, shipLength, shipVertical);
        const coordLong = my_gameboard.makeShipCoordsLong(shipCoordX, shipCoordY, shipLength, shipVertical);
        if (!my_gameboard.checkShip(coordShort) && !my_gameboard.shipCollides(coordLong)) {
          my_gameboard.ships.splice(my_gameboard.activeShipInd, 1);
          my_gameboard.ships.push(new Ship(shipCoordX, shipCoordY, shipLength, shipVertical));
          my_gameboard.removeShip();
        } else {
          my_gameboard.updateShipCells('inactive');
          my_gameboard.renderBoard(my_board);
        }
        my_gameboard.shipActive = false;
        my_gameboard.activeShipInd = '';
        my_board.removeEventListener('click', moveShip);
        my_gameboard.removeShip(my_board);
        my_gameboard.renderBoard(my_board);
      }
      my_board.addEventListener('click', moveShip);
    };
    my_gameboard.onMoveShip();
  }
}

user.my_gameboard.drawBoard(my_board);
user.my_gameboard.renderBoard(my_board);
my_board.addEventListener('dblclick', onChooseShip);

// Start the game when user clicks on 'start game' button
start_game.addEventListener('click', function() {
    this.style.display = 'none';
    // unregister onChooseShip handler
    comp_gameboardEl.style.display = 'block';
    my_board.removeEventListener('dblclick', onChooseShip);
    addCellListeners();
});
