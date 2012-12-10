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

  if(this.entrance) {
    this.entrance.setSide(HexCell.CARDINALS.northWest, HexCell.OPEN);
    this.entrance.setSide(HexCell.CARDINALS.north, HexCell.OPEN);
    this.entrance.setSide(HexCell.CARDINALS.northEast, HexCell.OPEN);
  }
  if(this.exit) {
    this.exit.setSide(HexCell.CARDINALS.southWest, HexCell.OPEN);
    this.exit.setSide(HexCell.CARDINALS.south, HexCell.OPEN);
    this.exit.setSide(HexCell.CARDINALS.southEast, HexCell.OPEN);
  }
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
  var mazeSet = paper.set();
  mazeSet.push(
    this.grid.render(paper).attr({
      'stroke': '#71c6d2',
      "stroke-width": "1",
      "stroke-linecap": "round",
    })
  );
  if(this.entrance && this.exit) {
    var r = this.grid.radius / 2.5;
    var a = this.entrance.getCenter();
    var b = this.exit.getCenter();
    mazeSet.push(
      paper.circle(a[0], a[1], r).attr({"fill":"#565253", "stroke":""}),
      paper.circle(b[0], b[1], r).attr({"fill":"#565253", "stroke":""})
    )
  }

  return mazeSet;
};