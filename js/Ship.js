class Ship {
  constructor(x, y, length, vertical = false) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.vertical = vertical;
    this.hit = [];
    this.coords = (() =>  {
      let coords = [];
      if(!this.vertical) {
        for (let i = this.x; i < this.x + this.length; i++) {
          coords.push({x: i, y: this.y});
        }
      } else {
        for (let i = this.y; i < this.y + this.length; i++) {
          coords.push({x: this.x, y: i});
        }
      }
       return coords;
    })();
  }

  addHit(x, y) {
    this.hit.push({x: x, y: y});
  }

  isSunk() {
  //  console.log(this.hit);
  //  console.log(this.length);
    if (this.hit.length === this.length) {
      return true;
    } else {
      return false;
    }
  }
}
