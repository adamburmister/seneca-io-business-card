/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexGrid = function(radius, w, h) {
  this.width = w;
  this.height = h;

  this.grid = new Array(this.height);
  for (var i=0; i <= this.height; i++) {
    this.grid[i] = new Array(this.width);
    for (var j=0; j < this.width; j++) {
      this.grid[i][j]= new HexCell(radius, j, i);
    }
  }

  this.generateMaze();
}

HexGrid.prototype.getCell = function(x, y) {
  return this.grid[y][x];
};

HexGrid.prototype.render = function(paper) {
  var cell;
  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      cell = this.getCell(x,y);
      paper.path(cell.toString());
    }
  }
};

HexGrid.prototype.getAccessibleNeighbours = function(cell) {
  var neighbours = {};
  var cardinals = [];//Object.keys(cell.neighbours).join(",");
  var isOdd = (cell.gridY % 2 != 0);

  // var middle = (cell.gridY > 1 && cell.gridY < this.height - 3);
  // var center = isOdd ? () : ();

  // if(center && middle) {
  //   cardinals = ['north','northEast','southEast','south','southWest','northWest'];
  // } else {

  // }

  // // first column
  // if(cell.gridX == 0) {
  //   if(cell.gridY == 0) {
  //     cardinals = cardinals.replace(/(north|northEast|northWest)(,+|$)/g,"")
  //   } else if(cell.gridY == 1) {
  //     cardinals = cardinals.replace(/(north|(north|south)+West)(,+|$)/g,"");
  //   } else if(isOdd) {
  //     cardinals = cardinals.replace(/(north|south)+West(,+|$)/g,"");
  //   }
  // }

  // // Last column
  // if(cell.gridX == this.width - 1) {
  //   cardinals = cardinals.replace(/(northEast|southEast)(,+|$)/g,"");
  //   if(cell.gridY == 0) {
  //     cardinals = cardinals.replace(/(northWest|north)(,+|$)/g,"")
  //   }
  //   if(cell.gridY >= this.height - 3) {
  //     cardinals = cardinals.replace(/south(,+|$)/g,"")
  //   }
  // }

  // // Last row
  // if(cell.gridY == this.height - 1) {
  //   // cardinals = cardinals.replace(/south(,+|$)/g,"")
  //   // if(cell.gridX == this.height - 1) {
  //     cardinals = cardinals.replace(/(south|southEast|southWest|northWest)(,+|$)/g,"")
  //   // }
  // }

  // Copy the accessible cardinals to the response
  // cardinals = cardinals.replace(/,$/g,"").split(",");
  for(var i=0; i < cardinals.length; i++) {
    cardinal = cardinals[i];
    neighbours[cardinal] = cell.neighbours[cardinal];
  }

  return neighbours;
};


HexGrid.prototype.generateMaze = function() {

  // http://www.experts-exchange.com/Programming/Languages/Scripting/JavaScript/A_7849-Hex-Maze.html

  var cell,
      nextCell,
      neighbours = [],
      closedNeighbours = [];

  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      cell = this.getCell(x,y);
      neighbours = this.getAccessibleNeighbours(cell);

      // 2) Check the neighboring cells:  Make a list of neighbors that have never been visited (i.e., have no doors).
      // When done, the list contain up to six possible directions to move.
      for(var i=0; i < neighbours.length; i++) {
        var nCell = neighbours[i];
        if(nCell.isClosed()) {
          closedNeighbours.push(nCell);
        }
      }

      if(closedNeighbours.length == 0) {
        // 3) If the list is empty (you are stuck), scan to locate any cell that has been visited that is next to a cell
        // that has not.  Set that as the current cell and go to 2.
      }

      // 4) Choose randomly from that list of available directions.
      nextCell = closedNeighbours[ Math.round(Math.random() * closedNeighbours) ];

      // 5) Set the corresponding door for the current cell.

      // 6) Move into the new cell (update X,Y) and set the corresponding door for the new cell.
      // 7) If all cells have at least one door, we're done.  Otherwise go to 2.


      // for(var i = 0; i < cell.sides.length; i++) {
      //   if((x <= 1) || (y <= 0)) {
      //     continue;
      //   }
      //   cell.sides[i] = Math.round(Math.random());
      // }
    }
  }
};