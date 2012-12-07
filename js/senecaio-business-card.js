var SenecaioBusinessCard = function(el, radius){
  $el = $('#'+el);

  const width = 250.45; // these are from the moocard dimensions
  const height = 167.24;

  // this.$el = $el = $(el);
  $el.empty();

  this.paper = Raphael(el, width, height);
  this.paper.rect(0, 0, width, height).attr({"fill":"#71c6d2","stroke":""});

  var c = new HexCell(radius, 0, 0);
  var w = Math.floor(width / (c.width + c.side) + 1 );
  var h = Math.floor(height / Math.ceil(radius/2 * Math.sqrt(3)));

  var grid = new HexGrid(radius, w, h);
  this.maze = new HexMaze(grid, grid.getCell(0,0), grid.getCell(grid.width-1, grid.height-5));
};

SenecaioBusinessCard.prototype._getLogo = function() {
    // var rsr = Raphael('rsr', '429', '84');
    rsr = this.paper;

    var logo = this.paper.set();

    var hex = this.paper.set().push(
      rsr.path("M 51.719,41.729 51.694,41.771 51.694,41.771 z"),
      rsr.path("M72.961,5H30.269L8.818,42l21.451,37h42.692l21.454-37L72.961,5z M51.719,41.729l-0.025,0.043l0,0 L51.719,41.729z M66.744,66H38.868l14.007-24L38.868,18h27.876l14.009,24L66.744,66z")
    )
    var type = this.paper.set().push(
      rsr.path("M159.836,25.605c1.726,0.751,3.34,1.877,4.841,3.378l-4.503,4.503c-1.501-1.801-3.603-2.701-6.305-2.701    c-2.702,0-4.428,0.638-5.178,1.913c-0.751,1.276-0.751,2.364,0,3.265c0.75,0.9,2.477,1.576,5.178,2.026    c2.852,0.301,5.441,1.238,7.768,2.814s3.49,4.091,3.49,7.543c0,2.702-1.242,5.029-3.727,6.98s-5.378,2.927-8.68,2.927    c-3.138,0-5.757-0.45-7.858-1.351c-2.102-0.901-3.903-2.102-5.404-3.603l4.503-4.504c1.501,1.802,4.053,2.853,7.655,3.152    c3.002,0,4.875-0.638,5.618-1.914c0.743-1.275,0.743-2.551,0-3.827c-0.743-1.275-2.616-2.063-5.618-2.364    c-2.702-0.3-5.179-1.126-7.43-2.477c-2.251-1.352-3.377-3.678-3.377-6.98c0-2.986,1.28-5.385,3.839-7.193s5.19-2.713,7.892-2.713    C155.678,24.48,158.11,24.855,159.836,25.605z"),
      rsr.path("M188.714,58.254V24.502l24.812-0.021v6.305h-18.058v7.204h13.532v6.282h-13.532v7.678h18.013v6.305 H188.714z"),
      rsr.path("M237.614,58.254V24.48h2.252l21.164,21.164V24.48h6.755v33.773h-2.477l-20.939-20.939v20.939H237.614z"),
      rsr.path("M292.797,58.254V24.502l24.812-0.021v6.305h-18.058v7.204h13.531v6.282h-13.531v7.678h18.013v6.305 H292.797z"),
      rsr.path("M343.845,53.401c-3.234-3.22-4.852-7.253-4.852-12.102c0.015-4.743,1.636-8.732,4.863-11.968    c3.228-3.234,7.228-4.852,12.001-4.852c4.818,0,8.953,1.501,12.406,4.503l-4.503,4.931c-2.297-1.801-4.932-2.701-7.903-2.701    c-3.032,0.015-5.476,0.961-7.329,2.836c-1.854,1.877-2.78,4.278-2.78,7.206c0.015,3.137,0.953,5.629,2.814,7.475    c1.86,1.847,4.308,2.77,7.34,2.77s5.651-0.893,7.858-2.68l4.503,4.932c-3.438,3.002-7.573,4.503-12.406,4.503    C351.084,58.239,347.08,56.621,343.845,53.401z"),
      rsr.path("M389.781,58.254l13.51-33.773h6.755l13.487,33.751l-7.183,0.022l-2.026-5.179h-15.311l-2.027,5.179    H389.781z M406.849,33.486l-5.134,12.834h10.133L406.849,33.486z"),
      rsr.path("M433.719,384.729l-0.025,0.043L433.719,384.729z"),
      rsr.path("M433.719,384.729l-0.025,0.043L433.719,384.729z")
    );
    logo.push(hex, type);

    return logo;
};

// Make space in the maze for the logo in the bottom right corner
SenecaioBusinessCard.prototype._addLogoToMaze = function() {
  const logoWidthInCells = 6;
  const logoHeightInCells = 6;

  var grid = this.maze.grid;
  for(var y = grid.height - logoHeightInCells; y < grid.height; y++) {
    var even = (y % 2 == 0);
    // var firstRow = y == (grid.height - logoHeightInCells);
    for(var x = grid.width - logoWidthInCells; x < grid.width; x++) {
      // var firstCol = (x == grid.width - logoWidthInCells);
      var cell = grid.getCell(x, y);

      // If it's not the exit cell we can close it off for the logo region
      if(!(x == this.maze.exit.gridX && y == this.maze.exit.gridY)) {
        // Treat even and odd rows differently
        if(even) {
          if(y == (grid.height - logoHeightInCells) + 1) {
            cell.sides = [HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.CLOSED,HexCell.CLOSED,HexCell.CLOSED];
          } else if(x == (grid.width - logoWidthInCells)) {
            cell.setSide(HexCell.CARDINALS.southEast, HexCell.CLOSED);
            cell.setSide(HexCell.CARDINALS.northEast, HexCell.CLOSED);
          } else {
            cell.sides = [HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN];
          }
        } else {
          if(y == (grid.height - logoHeightInCells) + 2) {
            cell.sides = [HexCell.CLOSED,HexCell.CLOSED,HexCell.CLOSED,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN];
          } else if(x == (grid.width - logoWidthInCells)) {
            cell.setSide(HexCell.CARDINALS.southEast, HexCell.CLOSED);
            cell.setSide(HexCell.CARDINALS.northEast, HexCell.CLOSED);
          } else {
            cell.sides = [HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN,HexCell.OPEN];
          }
        }
      }
    }
  }
  // Ensure the exit cell is still open
  this.maze.exit.setSide(HexCell.CARDINALS.northWest, HexCell.OPEN);
  this.maze.exit.setSide(HexCell.CARDINALS.southWest, HexCell.OPEN);
};

SenecaioBusinessCard.prototype.render = function() {
  this.maze.generate();
  this._addLogoToMaze();
  // this.paper.path( this._getLogo() );
  var logo = this._getLogo().attr({fill: '#FFFFFF','stroke-width': '0'}).transform("S0.18,0.18,0,0 T152,139");
  // console.log(logo);
  this.maze.render(this.paper).transform("T15,10");
};