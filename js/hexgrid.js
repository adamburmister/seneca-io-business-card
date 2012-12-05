/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexGrid = function(radius, w, h) {
  // this.renderAccessibleNeighbourCardinals = false;
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

HexGrid.prototype.openCell = function(x, y, cardinal) {
  var target = this.getCell(x,y);
  var sideNeighbour = target.setSide(cardinal, HexCell.OPEN);
  var openedTo = this.getCell(sideNeighbour.gridCoords[0], sideNeighbour.gridCoords[1]);
  var correspondingSide = ((cardinal + 3) % 6);
  openedTo.setSide( correspondingSide, HexCell.OPEN);
}

// Render the grid to a Raphael paper
HexGrid.prototype.render = function(paper) {
  var cell;
  var path = "";
  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      cell = this.getCell(x,y);
      paper.path(cell.toString());
      // path += cell.render();

      // // DEBUG
      // if(this.renderAccessibleNeighbourCardinals) {
      //   var r = 2;
      //   var cardToPointIndex = {
      //     north:     0,
      //     northEast: 1,
      //     southEast: 2,
      //     south:     3,
      //     southWest: 4,
      //     northWest: 5
      //   };

      //   var dx = 0;
      //   var dy = 0;
      //   var coords;
      //   $.each(this.getAccessibleNeighbours(cell), function(cardinal) {
      //     if(true || cardinal == "northWest") {
      //       coords = cell.points[ cardToPointIndex[cardinal] ];
      //       dx = dy = 0;

      //       switch(cardinal) {
      //         case "north":
      //           dx = (cell.side - (cell.width - cell.side)) / 2;
      //           dy = (r*2);
      //           break;
      //         case "northEast":
      //           dx = (cell.radius / 4) - r*2;
      //           dy = (cell.height / 4) + r*2;
      //           break;
      //         case "northWest":
      //           dx = (cell.radius / 4) + r*2;
      //           dy = -(cell.height / 4) + r*2;
      //           break;
      //         case "southEast":
      //           dx = -(cell.radius / 4) - r*2;
      //           dy = (cell.height / 4) - r;
      //           break;
      //         case "southWest":
      //           dx = -r;
      //           dy = -(cell.height / 4) -r;
      //           break;
      //         case "south":
      //           dx = -(cell.side - (cell.width - cell.side)) / 2;
      //           dy = -r*2;
      //       }

      //       paper.circle(coords[0] + dx, coords[1] + dy, r).attr({"fill":"#ccc", "stroke":""});
      //     }
      //   });
      // }
      //   // -- end debug code
    }
  }
  // paper.path(path);
};

// Which neighbouring cells can be moved into?
HexGrid.prototype.getAccessibleNeighbours = function(cell) {
  var neighbours = {};
  var cardinals = Object.keys(cell.neighbours);
  var even = (cell.gridY % 2 == 0);

  function notAccessible() {
    var removed = [];
    for(var i in arguments) {
      var s = arguments[i];
      var p = cardinals.indexOf(s);
      if(p != -1) {
        removed = cardinals.splice(p , 1);
      }
    }
    return removed;
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
  // cardinals = cardinals.replace(/,$/g,"").split(",");
  for(var i=0; i < cardinals.length; i++) {
    cardinal = cardinals[i];
    neighbours[cardinal] = cell.neighbours[cardinal];
  }

  return neighbours;
};
