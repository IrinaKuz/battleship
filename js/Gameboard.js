class Gameboard{
  constructor(ships = []) {
    this.width = 10;
    this.height = 10;
    this.cellWidth = 30;
    this.ships = ships; // an array of ships
    this.matrix = (() => {
      let arr = [];
      for (let y = 0; y < this.height; y++) {
        for(let x = 0; x < this.width; x++) {
          arr.push({x: x, y: y, status: 'o'}); // status: 'o' = empty; 'x' = miss; 's' = ship; 'sa' = ship attacked
        }
      }
      return arr;
    })();
    this.myTotalSunk = 0;
    this.shipActive = false;
    this.activeShipInd; // index of an active ship (that was clicked)
    this.placeShips();
  }

  // place ships on the gameboard
  placeShips() {
    if(this.ships.length > 0) {
      for(let i = 0; i < this.ships.length; i++) {
        const ship = this.ships[i];
        for(let j = 0; j < ship.coords.length; j++) {
          const index = this.findCellByXY(ship.coords[j].x, ship.coords[j].y);
          this.matrix[index].status = 's';
        }
      }
    }
  }

  receiveAttack(coord) {
    const x = coord.x;
    const y = coord.y;
    const cell_stat = this.checkCells(x, y);
    const cell_ind = this.findCellByXY(x, y);
    let result; // result of the move  - hit/ miss/ sunk
    if(cell_stat === 0) {
      // record attack
      this.matrix[cell_ind].status = 'O';
      result = 'miss';
    } else if (cell_stat === 1){
      console.log("Your ship is hit");
      this.matrix[cell_ind].status = 'X';
      result = 'hit';
      // update ships
      let ind;
      try {
        ind = this.findShip(x, y);
        if(ind === undefined) throw "Ship is undefined";
        if(ind > this.ships.length - 1) throw "The index is too high!";
      }
      catch(err) {
        console.error(err);
      }
      this.ships[ind].addHit(x, y);
  //    console.log(this.matrix);
      if(this.ships[ind].isSunk()) {
        console.log('Your ship is sunk');
        result = 'sunk';
        this.myTotalSunk++;
      }
      if(this.myTotalSunk >= this.ships.length) {
        // game ends!
        result = 'lost';
      }
      // move ends
    } else {
      // illelal move; the sell.status is x or sa
      console.log('Illegal move!');
    }
    return result;
  }

  checkCells(x, y) {
    const index = this.findCellByXY(x, y);
    if(this.matrix[index].status === 'o') {
      return 0; // cell is empty
    } else if (this.matrix[index].status === 's') {
      return 1; // cell has a ship
    } else {
      return -1; // illegal move
    }
  }

  findCellByXY(x, y) {
    return this.matrix.findIndex(el => el.x == x && el.y == y);
  }

  findShip(x, y) {
    for(let i = 0; i < this.ships.length; i++) {
      const coord = this.ships[i].coords;
      if(coord.findIndex(el => el.x == x & el.y == y) > -1) {
        return i;
      }
    }
  }

  updateBoard(coord, status) {
    const ind = this.findCellByXY(coord.x, coord.y);
    switch (status) {
      case 'miss':
        this.matrix[ind].status = 'O';
        console.log('You missed!');
        break;
      case 'hit':
        this.matrix[ind].status = 'X';
        console.log('You hit a ship!');
        break;
      case 'sunk':
        this.matrix[ind].status = '!';
        console.log('You sunk a ship!');
        break;
      case 'lost':
        this.matrix[ind].status = 'X';
        break;
      default:
        console.log('Illegal move!');
    }
  }

  drawBoard(parent) {
    for(let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const div = document.createElement('div');
        div.setAttribute('class', 'cell');
        const id = i * 10 + j;
        div.setAttribute('id', `cell_${id}`);
        div.style.top = (i * this.cellWidth) + 'px';
        div.style.left = (j * this.cellWidth) + 'px';
        div.style.width = this.cellWidth + 'px';
        div.style.height = this.cellWidth + 'px';
        parent.append(div);
        this.matrix[i * 10 + j].el = div;
      }
    }
  }

  renderBoard(parent) {
    const cells = parent.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
      if(this.matrix[i].status != 'o') {
        cells[i].textContent = this.matrix[i].status;
        if(this.matrix[i].status == 's') {
          cells[i].classList.add('ship');
        } else if (this.matrix[i].status == 'sa' || this.matrix[i].status == 'X') {
          cells[i].classList.add('hit');
        } else if(this.matrix[i].status == '!') {
          cells[i].classList.add('sunk');
        }
      }
    }
  }

  makeShipCoords(x, y, length, isVertical) {
    let coords = [];
    let i;
    if(!isVertical) {
      for (i = x - 1; i < length + x + 1; i++) {
        coords.push({x: i, y: y - 1});
        coords.push({x: i, y: y});
        coords.push({x: i, y: y + 1});
      }
    } else {
      for (i = y - 1; i < length + y + 1; i++) {
        coords.push({x: x - 1, y: i});
        coords.push({x: x, y: i});
        coords.push({x: x + 1, y: i});
      }
    }
    return coords;
  }

// check if random coordinates collide with existing ship
  shipCollides(coords) {
    for(let i = 0; i < coords.length; i++) {
      if(this.findShip(coords[i].x, coords[i].y) != undefined) {
        return true;
      }
   }
    //  console.log('Result of findShip ' + this.findShip(coords[i].x, coords[i].y));
  }

  chooseRandomShips() {
    let randX;
    let randY;
    let coords;
    let shipDir;
    for (let i = 4; i >= 0; i--) {
      if(i == 0 || i == 1) {
        for (let j = 0; j < 2; j++) {
          do {
            randX = Math.floor(Math.random() * (this.width - i));
            randY = Math.floor(Math.random() * (this.height - i));
            shipDir = Math.random() >= 0.5;
            coords = this.makeShipCoords(randX, randY, i+1, shipDir);
          }
          while (this.shipCollides(coords));
          let ship = new Ship(randX, randY, i+1, shipDir);
          this.ships.push(ship);
        }
      } else {
        do {
          randX = Math.floor(Math.random() * (this.width - i));
          randY = Math.floor(Math.random() * (this.height - i));
          shipDir = Math.random() >= 0.5;
          coords = this.makeShipCoords(randX, randY, i+1, shipDir);

        }
        while (this.shipCollides(coords));
        let ship = new Ship(randX, randY, i+1, shipDir);
        this.ships.push(ship);
      }
    }
    console.log(this.ships);
    this.placeShips();
  }

  activateShipHandler(board) {
      let gameboard = this;
      board.addEventListener('dblclick', function(e) {
        e.preventDefault();
        gameboard.shipActive = false;
        gameboard.activeShipInd = '';
        const boardRect = board.getBoundingClientRect();
        const left = boardRect.x;
        const top = boardRect.y;
        let coordX = e.clientX - left;
        let coordY = e.clientY - top;
        const getCell = gameboard.getCellIndex.bind(gameboard, coordX, coordY);
        const cellInd = getCell();
        const getShip = gameboard.getShip.bind(gameboard, cellInd);
        getShip();
        });
  }

  getCellIndex(x, y) {
    let cX = Math.floor(x / 30);
    let cY = Math.floor(y /30);
    let index = this.findCellByXY(cX, cY);
    return index;
  }

  getShip(cellInd) {
    const cellY = Math.floor(cellInd / this.width);
    const cellX = cellInd % this.width;
    if(this.matrix[cellInd].status === 's') {
        this.activeShipInd = this.findShip(cellX, cellY);
        this.shipActive = true;
        this.moveShipHandler();
    }
  }

  moveShipHandler() {
    const gameboard = this;
        document.querySelector('#my_board').addEventListener('click', function(e) {
          let leftC, topC;
          const boardRect = document.querySelector('#my_board').getBoundingClientRect();
          const left = boardRect.x;
          const top = boardRect.y;
          leftC = e.clientX - left;
          topC = e.clientY - top;
          console.log(e.clientX + ' ' + e.clientY);
          console.log(leftC + ' ' + topC);
          const shipCoordX = Math.floor(leftC / 30);
          const shipCoordY = Math.floor(topC / 30);
          console.log(shipCoordX + ' ' + shipCoordY);
          gameboard.ships.push(new Ship(shipCoordX, shipCoordY, gameboard.ships[gameboard.activeShipInd].length, gameboard.ships[gameboard.activeShipInd].vertical));
          gameboard.shipActive = false;
        });
  }

  endGame(text) {
    document.querySelector('#end_game').textContent = text;
    document.querySelector('#end_game').style.display = 'flex';
  }
}
