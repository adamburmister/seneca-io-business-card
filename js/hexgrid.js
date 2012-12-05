/* Construct a hexagon cell of a given radius at grid x, y coordinates */
var HexGrid = function(radius, w, h) {
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
  this.generateMaze();
}

// Simplify X/Y accessors for cells
HexGrid.prototype.getCell = function(x, y) {
  return this.grid[y][x];
};

// Render the grid to a Raphael paper
HexGrid.prototype.render = function(paper) {
  var cell;

  var renderAccessibleNeighbourCardinals = true;
  var r = 3;
  var cardToPointIndex = {
    north:     0,
    northEast: 1,
    southEast: 2,
    south:     3,
    southWest: 4,
    northWest: 5
  };

  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      cell = this.getCell(x,y);
      paper.path(cell.toString());

      // DEBUG
      if(renderAccessibleNeighbourCardinals) {
        var dx = 0;
        var dy = 0;
        var coords;
        $.each(this.getAccessibleNeighbours(cell), function(cardinal) {
          if(true || cardinal == "northWest") {
            coords = cell.points[ cardToPointIndex[cardinal] ];
            dx = dy = 0;

            switch(cardinal) {
              case "north":
                dx = (cell.side - (cell.width - cell.side)) / 2;
                dy = (r*2);
                break;
              case "northEast":
                dx = (cell.radius / 4) - r*2;
                dy = (cell.height / 4) + r*2;
                break;
              case "northWest":
                dx = (cell.radius / 4) + r*2;
                dy = -(cell.height / 4) + r*2;
                break;
              case "southEast":
                dx = -(cell.radius / 4) - r*2;
                dy = (cell.height / 4) - r;
                break;
              case "southWest":
                dx = -r;
                dy = -(cell.height / 4) -r;
                break;
              case "south":
                dx = -(cell.side - (cell.width - cell.side)) / 2;
                dy = -r*2;
            }

            paper.circle(coords[0] + dx, coords[1] + dy, r);
          }
        });
        // -- end debug code
      }
    }
  }
};

// Which neighbouring cells can be moved into?
HexGrid.prototype.getAccessibleNeighbours = function(cell) {
  var neighbours = {};
  var cardinals = Object.keys(cell.neighbours);
  var isOdd = (cell.gridY % 2 != 0);

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
    if(isOdd) {
      notAccessible('northWest','southWest'); 
    }
  }
  // Last column
  if(cell.gridX == this.width - 1) {
    if(!isOdd) {
      if(cell.gridY <= this.height - 2) {
        notAccessible('northEast','southEast'); 
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
      var that = this;
      $.each(neighbours, function(cardinal, gridCoords) {
        // var neighbour = that.getCell(gridCoords[1], gridCoords[0]);
        // console.log(cell.gridX, cell.gridY, cardinal, gridCoords, neighbour);
        // if(!neighbour) {
        //   console.log("Neighbour not found", gridCoords[1], gridCoords[0])
        //   return;
        // }
        // if(neighbour.isClosed()) {
        //   closedNeighbours.push(neighbour);
        // }
      });

      if(closedNeighbours.length == 0) {
        // 3) If the list is empty (you are stuck), scan to locate any cell that has been visited that is next to a cell
        // that has not.  Set that as the current cell and go to 2.
        console.log("Dead end", cell);
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