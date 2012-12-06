/**
 Generate a maze from a hexagon grid.
 @param {HexGrid} The populated grid to mazify (look, I made up a word!)
 */
var HexMaze = function(grid, entrance, exit) {
  this.grid = grid;
  this.entrance = entrance;
  this.exit = exit;
}

/**
 Recursive backtracking maze generator
 @param {HexCell} the current cell
 @param {HexCell} the cell we're exiting from
 */
HexMaze.prototype.generate = function() {
  this._recursivelyGenerate(this.entrance);

  this.entrance.setSide(0, HexCell.OPEN);
  this.entrance.setSide(1, HexCell.OPEN);

  this.exit.setSide(3, HexCell.OPEN);
  this.exit.setSide(4, HexCell.OPEN);
};

HexMaze.prototype._recursivelyGenerate = function(cell) {
  if(!cell) return;

  // Find any neighbours we can walk to
  var neighbours = this.grid.getAccessibleNeighbours(cell, true);

  // Randomise our moves
  var keys = Object.keys(neighbours).sort(function() { return 0.5 - Math.random(); });
  for(var i=0; i < keys.length; i++) {
    var cardinal = keys[i];
    var move = neighbours[cardinal];
    if(!move.visited) {
      move.visited = true;
      this.grid.openSide(cell, HexCell.CARDINALS[cardinal]);
      this._recursivelyGenerate(move);
    }
  }
};

// Render the grid to the paper, as well as entrance and exit points
HexMaze.prototype.render = function(paper) {
  this.grid.render(paper);
  var r = this.grid.radius / 2.5;
  var a = this.entrance.getCenter();
  var b = this.exit.getCenter();

  paper.circle(a[0], a[1], r).attr({"fill":"#000","fill-opacity": 0.5, "stroke":""});
  paper.circle(b[0], b[1], r).attr({"fill":"#000","fill-opacity": 0.5, "stroke":""});
};