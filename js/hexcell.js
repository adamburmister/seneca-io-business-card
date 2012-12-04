/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexCell = function(radius, x, y) {
  this.radius = radius;
  this.width = Math.floor(radius * 2);
  this.height = Math.floor(radius * Math.sqrt(3));
  this.side = Math.floor(radius * 3 / 2);  // Length of a side

  this.gridX = x;
  this.gridY = y;

  this.top   = y * this.height / 2;
  this.left  = x * this.width;
  if(y % 2 == 0) {
    this.left += this.side;
  }

  this.points = [];
  this.sides  = [true, true, true, true, true, true];
  this.neighbours = {};

  this.calcNeighbours();
  this.calcPoints();
};

// Hexagon math
HexCell.prototype.calcPoints = function() {
  var halfRadius = Math.floor(this.radius / 2);
  var halfHeight = Math.floor(this.height / 2);

  var dx = [ halfRadius, this.side, this.width, this.side, halfRadius, 0 ];
  var dy = [ 0, 0, halfHeight, this.height, this.height, halfHeight ];

  var offset = this.side * this.gridX;

  var topLength = this.radius * Math.sin(60 * Math.PI / 180);
  var offset = topLength * this.gridX;

  for(var i=0; i<6; i++) {
    this.points[i] = [ this.left + dx[i] + offset, this.top + dy[i] ]
  }
}

// Calculate the grid neighbours
HexCell.prototype.calcNeighbours = function() {
  this.neighbours.north     = [this.gridX - 1, this.gridY - 1];
  this.neighbours.northEast = [this.gridX,     this.gridY - 1];
  this.neighbours.southEast = [this.gridX + 1, this.gridY];
  this.neighbours.south     = [this.gridX + 1, this.gridY + 1];
  this.neighbours.southWest = [this.gridX,     this.gridY + 1];
  this.neighbours.northWest = [this.gridX - 1, this.gridY];
}

/**
 Set the side edge state for the hexagon cell to be open or closed
 @param i 0-based index of side
 @param state boolean False for closed, true for open
 @returns coordinates of the neighbour in the parent grid to modify to the same state
*/
HexCell.prototype.setSide = function(i, state) {
  this.sides[i] = state;

  var correspondingNeighbour = {
    1: this.neighbours.northWest,
    2: this.neighbours.north,
    3: this.neighbours.northEast,
    4: this.neighbours.southEast,
    5: this.neighbours.south,
    6: this.neighbours.southWest
  };

  return {
    gridCoord: correspondingNeighbour[i],
    state: state
  };
}

HexCell.prototype.toString = function() {
  var path = "";
  var x, y;
  for (var i = 0; i < 6; i++) {
    x = this.points[i][0];
    y = this.points[i][1];
    path += (i == 0 ? "M" : "L") + x + "," + y
  }
  path += "Z"
  return path;
}