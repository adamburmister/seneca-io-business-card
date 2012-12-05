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

  // Now open doors within the hexagon cells to make a maze
  this.generateMaze( this.getCell(0,0) );
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

  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      cell = this.getCell(x,y);
      paper.path(cell.toString());

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

// Source: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
// Here’s the mile-high view of recursive backtracking:
// * Choose a starting point in the field.
// * Randomly choose a wall at that point and carve a passage through to the
//   adjacent cell, but only if the adjacent cell has not been visited yet. 
//   This becomes the new current cell.
// * If all adjacent cells have been visited, back up to the last cell that
//   has uncarved walls and repeat.
// * The algorithm ends when the process has backed all the way up to the
//   starting point.
HexGrid.prototype.generateMaze = function(cell, i) {
  if(!cell) return;

  var that = this,
      next = null,
      accessibleNeighbours = [],
      closedNeighbours = [];

  // Find any neighbours we can walk to
  accessibleNeighbours = this.getAccessibleNeighbours(cell);
  // Filter them to one's without any open sides
  $.each(accessibleNeighbours, function(cardinal, gridCoords) {
    var neighbour = that.getCell( gridCoords[0] , gridCoords[1] );
    if(neighbour && neighbour.isClosed()) {
      closedNeighbours.push({ cardinal: cardinal, cell: neighbour });
    }
  });

  if(closedNeighbours.length > 0) {
    // Choose randomly from that list of available directions.
    var r = closedNeighbours[ Math.round( Math.random() * (closedNeighbours.length - 1) ) ];
    // Open a side randomly in the current cell
    this.openCell(cell.gridX, cell.gridY, HexCell.CARDINALS[r.cardinal]);
    next = r.cell;
  } else {
    // If the list is empty (you are stuck), scan to locate any cell that has 
    // been visited that is next to a cell that has not and recurse with it.
    var t = null;
    
    // Randomly open an edge so there are no unopened hex cells
    var keys = Object.keys(accessibleNeighbours);
    var k = keys[ Math.round( Math.random() * (keys.length - 1)) ];
    this.openCell(cell.gridX, cell.gridY, HexCell.CARDINALS[k] );

    closed_cell_search: //label
    for(var y=0; y < this.height; y++) {
      for(var x=0; x < this.width; x++) {
        t = this.getCell(x, y);
        if(t.seen) continue;
        t.seen = true;
        if(t.isClosed()) {
          next = t;
          break closed_cell_search;
        }
      }
    }
    // Note: If all cells have at least one door, we're done. Otherwise recurse.
  }

  this.generateMaze(next);
};