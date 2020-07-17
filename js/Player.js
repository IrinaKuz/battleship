class Player {
  constructor(name, my_gameboard) {
    this.name = name;
    this.my_gameboard = my_gameboard;
  }

  makeMove() {
      let coord;
      do {
        coord = this.makeRandomMove();
      }
      while (this.my_gameboard.checkCells(coord.x, coord.y) === -1)
      console.log(this.name + " " + coord.x + " " + coord.y);
    return coord;
  }

  makeRandomMove() {
    return ({ x: Math.floor(Math.random()* this.my_gameboard.width),
              y: Math.floor(Math.random()* this.my_gameboard.height) });
  }

  chooseShip(boardEl) {
    debugger;
    this.my_gameboard.activateShipHandler(boardEl);
  }

}
