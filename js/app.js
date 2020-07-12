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

console.log(my_gameboard);
console.log(comp_gameboard);

async function drawBoards() {
  await user.my_gameboard.drawBoard(my_board);
  await user.op_gameboard.drawBoard(comp_board);
  await user.my_gameboard.renderBoard(my_board);
  cells_comp = comp_board.querySelectorAll('.cell');
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
  //await drawBoards();
  for (let i = 0; i < cells_comp.length; i++) {
    cells_comp[i].addEventListener('click', getCoords);
  }
}

drawBoards();
user.chooseShip(my_board);

// Start the game when user clicks on 'start game' button
start_game.addEventListener('click', function() {
  this.style.display = 'none';
  user.my_gameboard.deactivateShipHandler(my_board);
  addCellListeners();
});

function loop(coord) {
      let result = computer.my_gameboard.receiveAttack(coord);
      user.op_gameboard.updateBoard(coord, result);
      if(result == 'lost') {
        user.op_gameboard.endGame('You won!');
      }

      // redraw computer board
      user.op_gameboard.renderBoard(comp_board);

      let comp_coord = computer.makeMove();
      result = user.my_gameboard.receiveAttack(comp_coord);
      computer.op_gameboard.renderBoard(comp_board);
      if(result == 'lost') {
        user.op_gameboard.endGame('You lost!');
      }

      // redraw my_board
      user.my_gameboard.renderBoard(my_board);

      console.log(user.my_gameboard);
      console.log(computer.my_gameboard);
}
