class Player {
  constructor(name, my_gameboard, op_gameboard) {
    this.name = name;
    this.my_gameboard = my_gameboard;
    this.op_gameboard = op_gameboard;
  }
  makeMove() {
      let coord;
      do {
        coord = this.makeRandomMove();
      }
      while (this.op_gameboard.checkCells(coord.x, coord.y) === -1)
      console.log(this.name + " " + coord.x + " " + coord.y);
    return coord;
  }

  makeRandomMove() {
    return ({ x: Math.floor(Math.random()* this.my_gameboard.width),
              y: Math.floor(Math.random()* this.my_gameboard.height) });
  }

  chooseShip(board) {
    this.my_gameboard.activateShipHandler(board);
  }
}
