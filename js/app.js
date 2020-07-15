const my_board = document.querySelector('#my_board');
const comp_board = document.querySelector('#comp_board');
const start_game = document.querySelector('#start_game');
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
      user.op_gameboard.updateBoard(coord, result);
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
  const x = left / 30;
  const y = top / 30;
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
  const getCell = my_gameboard.getCellIndex.bind(my_gameboard, coordX, coordY);
  const cellInd = getCell();
  const getShip = my_gameboard.getShip.bind(my_gameboard, cellInd);
  const isShip = getShip();
  if (isShip) {
    const cellX = Math.floor(coordX / 30);
    const cellY = Math.floor(coordY /30);
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

        const shipCoordX = Math.floor(leftC / 30);
        const shipCoordY = Math.floor(topC / 30);
        const coord = my_gameboard.makeShipCoords(shipCoordX, shipCoordY, my_gameboard.ships[my_gameboard.activeShipInd].length, my_gameboard.ships[my_gameboard.activeShipInd].vertical);
        if (!my_gameboard.shipCollides(coord)) {
          const shipLength = my_gameboard.ships[my_gameboard.activeShipInd].length;
          const shipVertical = my_gameboard.ships[my_gameboard.activeShipInd].vertical;
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
    my_board.removeEventListener('dblclick', onChooseShip);
    addCellListeners();
});
