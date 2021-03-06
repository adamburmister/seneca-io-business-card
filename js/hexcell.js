/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexCell = function(radius, x, y) {
  this.radius = radius;
  this.width = (radius * 2);
  this.height = Math.sin(60 * (Math.PI/180)) * (radius * 2);
  this.side = (radius * 3 / 2);  // Length of a side
  this.gridX = x;
  this.gridY = y;
  this.top   = (y * this.height / 2);
  this.left  = (x * this.width);
  if(y % 2 == 0) { this.left += this.side; } // odd cells are pushed in to make the honeycomb

  this.sides  = [HexCell.CLOSED, HexCell.CLOSED, HexCell.CLOSED, HexCell.CLOSED, HexCell.CLOSED, HexCell.CLOSED];
  this.points = [];
  this.neighbours = {};

  this.calcNeighbours();
  this.calcPoints();
};

// Constants
HexCell.OPEN = false;
HexCell.CLOSED = true;
HexCell.CARDINALS = {
  northWest: 0,
  north: 1,
  northEast: 2,
  southEast: 3,
  south: 4,
  southWest: 5
}

// Calculate the corner points of the hexagon
HexCell.prototype.calcPoints = function() {
  var halfRadius = (this.radius / 2);
  var halfHeight = (this.height / 2);

  var dx = [ halfRadius, this.side, this.width, this.side, halfRadius, 0 ];
  var dy = [ 0, 0, halfHeight, this.height, this.height, halfHeight ];

  var topLength = (this.width - this.side) * 2;
  var offset = topLength * this.gridX;

  for(var i=0; i<6; i++) {
    this.points[i] = [ this.left + dx[i] + offset, this.top + dy[i] ]
  }
}

// Calculate the coordinates of neighbours in the grid
HexCell.prototype.calcNeighbours = function() {
  var even = (this.gridY % 2 == 0);

  this.neighbours.north = [this.gridX, this.gridY - 2];
  this.neighbours.south = [this.gridX, this.gridY + 2];

  if(even) {
    this.neighbours.northEast = [this.gridX + 1, this.gridY - 1];
    this.neighbours.southEast = [this.gridX + 1, this.gridY + 1];
    this.neighbours.southWest = [this.gridX,     this.gridY + 1];
    this.neighbours.northWest = [this.gridX,     this.gridY - 1];
  } else {
    this.neighbours.northEast = [this.gridX,     this.gridY - 1];
    this.neighbours.southEast = [this.gridX,     this.gridY + 1];
    this.neighbours.southWest = [this.gridX - 1, this.gridY + 1];
    this.neighbours.northWest = [this.gridX - 1, this.gridY - 1];
  }
}

// @return {boolean} Are there any open sides in this cell?
HexCell.prototype.isClosed = function() {
  return this.sides.reduce(function(prev,curr){ return prev && curr })
};

HexCell.prototype.convertIntToCardinalLabel = function(i) {
  var correspondingNeighbour = {
    0: 'northWest',
    1: 'north',
    2: 'northEast',
    3: 'southEast',
    4: 'south',
    5: 'southWest'
  };
  return correspondingNeighbour[i];
};

/**
 Set the side edge state for the hexagon cell to be open or closed
 @param {integer} i 0-based index of side
 @param {boolean} state False for closed, true for open
 @return {object} coordinates of the neighbour in the parent grid to modify to the same state
*/
HexCell.prototype.setSide = function(i, state) {
  this.sides[i] = state;
  return {
    gridCoords: this.neighbours[this.convertIntToCardinalLabel(i)],
    state: state
  };
};

HexCell.prototype.getCenter = function() {
  return [
    Math.round(this.points[0][0] + this.radius / 2),
    Math.round(this.points[1][1] + this.height / 2)
  ];
};

/**
 @return {string} Render the cell to a string for Raphael to work with
 */
// HexCell.prototype.toString = function() {
//   var path = "";
//   var x, y, a, lineExists;
//   for (var i = 0; i < this.points.length; i++) {
//     x = this.points[i][0];
//     y = this.points[i][1];
//     lineExists = false;
//     if(i === 0 || (this.sides[i] === HexCell.OPEN) || lineExists) {
//       a = "M";
//     } else {
//       a = "L";
//     }
//     path += a + x + "," + y
//   }
//   // And complete the shape to the start point of closed
//   if(this.sides[0] === HexCell.CLOSED) {
//     path += "L" + this.points[0][0] + "," + this.points[0][1]
//   }
//   return path;
// }