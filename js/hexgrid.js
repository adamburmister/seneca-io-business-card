/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexGrid = function(radius, w, h) {
  this.radius = radius;
  this.width = w;
  this.height = h;

  // Create a 2D array for the grid
  // The first accesor is Y, the second is X (rotate the board 90deg in your head)
  this.grid = new Array(this.height);
  for (var i=0; i <= this.height; i++) {
    this.grid[i] = new Array(this.width);
    for (var j=0; j < this.width; j++) {
      this.grid[i][j]= new HexCell(radius, j, i);
    }
  }
}

// Simplify X/Y accessors for cells
HexGrid.prototype.getCell = function(x, y) {
  if(x < 0 || y < 0 || x >= this.width || y >= this.height) {
    return null;
  }
  return this.grid[y][x];
};

HexGrid.prototype.openSide = function(cell, cardinal) {
  var sideNeighbour = cell.setSide(cardinal, HexCell.OPEN);
  var openedTo = this.getCell(sideNeighbour.gridCoords[0], sideNeighbour.gridCoords[1]);
  openedTo.setSide(((cardinal + 3) % 6), HexCell.OPEN);
}

// Find neighbouring cells which are non-boundary and can be moved into
// @param {HexCell} Find accessible neighbours for this cell
// @param {boolean} closed Only return neighbours that are closed
HexGrid.prototype.getAccessibleNeighbours = function(cell, closed) {
  var neighbours = {};
  var cardinals = Object.keys(cell.neighbours);
  var even = (cell.gridY % 2 == 0);

  // Remove a cardinal from the array
  function notAccessible() {
    for(var i in arguments) {
      var cardinal = arguments[i];
      cardinals = cardinals.filter(function(test,idx,arr) { return test != cardinal; });
    }
  }

  // If in top 2 rows
  if(cell.gridY <= 1) {
    notAccessible('north');
  }
  // top-most row
  if(cell.gridY == 0) {
    notAccessible('northWest','northEast');
  }
  // Bottom rows
  if(cell.gridY >= this.height - 2) {
    notAccessible('south');
  }
  // Bottom-most row
  if(cell.gridY == this.height - 1) {
    notAccessible('southEast','southWest');
  }

  // If first column
  if(cell.gridX == 0) {
    if(!even) {
      notAccessible('northWest','southWest');
    }
  }
  // Last column
  if(cell.gridX == this.width - 1) {
    if(even) {
      notAccessible('northEast');
      if(cell.gridY <= this.height - 2) {
        notAccessible('southEast');
      }
    }
  }

  // Copy the accessible cardinals to the response
  var cardinal, neighbour;
  for(var i=0; i < cardinals.length; i++) {
    cardinal = cardinals[i];
    neighbour = this.getCell(cell.neighbours[cardinal][0], cell.neighbours[cardinal][1]);
    if(!closed || neighbour.isClosed()) {
      neighbours[cardinal] = neighbour;
    }
  }

  return neighbours;
};

// @param {HexCell}
// @param {HexCell.CARDINAL|integer}
HexGrid.prototype.getNeighbourByDirection = function(cell, cardinal) {
  var coords = cell.neighbours[ cell.convertIntToCardinalLabel(cardinal) ];
  return this.getCell(coords[0], coords[1]);
};

HexGrid.prototype._renderCell = function(cell) {
  var grid = this;
  var path = "";
  var x, y, a, lineExists, neighbourAbove;
  for (var i = 0; i < cell.points.length; i++) {
    x = cell.points[i][0];
    y = cell.points[i][1];
    lineRendered = false;
    // has the neighbour above rendered this line already above?
    if(i <= HexCell.CARDINALS.northEast) {
      if(neighbourAbove = grid.getNeighbourByDirection(cell, i)) {
        lineRendered = (neighbourAbove.sides[((i + 3) % 6)] === HexCell.CLOSED);
      }
    }
    if(i === 0 || (cell.sides[i] === HexCell.OPEN) || lineRendered) {
      a = "M";
    } else {
      a = "L";
    }
    path += a + x + "," + y
  }
  // And complete the shape to the start point of closed
  if(cell.sides[0] === HexCell.CLOSED) {
    path += "L" + cell.points[0][0] + "," + cell.points[0][1]
  }
  return path;
};


// Render the grid to a Raphael paper
HexGrid.prototype.render = function(paper) {
  var cell;
  var path = "";
  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      path += this._renderCell(this.getCell(x,y));
    }
  }
  return paper.path(path);
};
