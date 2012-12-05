/**
 Generate a maze from a hexagon grid.
 @param {HexGrid} The populated grid to mazify (look, I made up a word!)
 */
var HexMaze = function(grid) {
  this.grid = grid;
}

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
HexMaze.prototype.generate = function(cell, target) {
  if(!cell) return;

  var grid = this.grid,
      next = null,
      accessibleNeighbours = [],
      closedNeighbours = [];

  // Find any neighbours we can walk to
  accessibleNeighbours = grid.getAccessibleNeighbours(cell);
  // Filter them to one's without any open sides
  $.each(accessibleNeighbours, function(cardinal, gridCoords) {
    var neighbour = grid.getCell( gridCoords[0] , gridCoords[1] );
    if(neighbour && neighbour.isClosed()) {
      closedNeighbours.push({ cardinal: cardinal, cell: neighbour });
    }
  });

  if(closedNeighbours.length > 0) {
    // Choose randomly from that list of available directions.
    var r = closedNeighbours[ Math.round( Math.random() * (closedNeighbours.length - 1) ) ];
    // Open a side randomly in the current cell
    grid.openCell(cell.gridX, cell.gridY, HexCell.CARDINALS[r.cardinal]);
    next = r.cell;
  } else {
    // If the list is empty (you are stuck), scan to locate any cell that has
    // been visited that is next to a cell that has not and recurse with it.
    var t = null;

    // Randomly open an edge so there are no unopened hex cells
    var keys = Object.keys(accessibleNeighbours);
    var k = keys[ Math.round( Math.random() * (keys.length - 1)) ];
    // this.openCell(cell.gridX, cell.gridY, HexCell.CARDINALS[k] );

    closed_cell_search: //label
    for(var y=0; y < grid.height; y++) {
      for(var x=0; x < grid.width; x++) {
        t = grid.getCell(x, y);
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

  this.generate(next);
};