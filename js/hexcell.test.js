describe("HexCell", function() {
  var north, northEast, southEast, south, southWest, northWest;
  var radius = 5;

  beforeEach(function() {
    hex = new HexCell(radius, 1, 1);
  });

  it("has a side length", function() {
    expect(hex.side).toBe(7);
  });

  it("has a height", function() {
    expect(hex.height).toBe( Math.floor(radius * Math.sqrt(3)) );
  });

  it("has a width", function() {
    expect(hex.width).toBe( Math.floor(radius * 2) );
  });

  describe("points", function() {
    it("is defined", function() {
      expect(hex.points).toNotBe(undefined);
    });
    it("is an array", function() {
      expect(hex.points instanceof Array).toBe(true);
    });
    it("is an array of 6 elements", function() {
      expect(hex.points.length).toBe(6);
    });
    it("should be correctly calculated for a radius of " + radius, function(){
      var expected = [ [ 18, 4 ], [ 23, 4 ], [ 26, 8 ], [ 23, 12 ], [ 18, 12 ], [ 16, 8 ] ];
      // expect(hex.points).toBe([]);
      for(var i=0; i<6; i++) {
        expect(hex.points[i][0]).toBe(expected[i][0]);
        expect(hex.points[i][1]).toBe(expected[i][1]);
      }
    });
    it("should offset correctly", function() {
      // TODO
    });
  });

  describe("sides", function() {
    it("is defined", function() {
      expect(hex.sides).toNotBe(undefined);
    });
    it("is an array", function() {
      expect(hex.sides instanceof Array).toBe(true);
    });
    it("is an array of 6 elements", function() {
      expect(hex.sides.length).toBe(6);
    });
    it("is closed if no sides are open", function() {
      expect(hex.isClosed()).toBe(true);
    });
    it("is !closed if a side is open", function() {
      hex.setSide(0, HexCell.OPEN);
      expect(hex.isClosed()).toBe(false);
    });

    describe("can be set", function() {
      it("to open", function() {
        hex.setSide(0, false);
        expect(hex.sides[0]).toBe(false);
      });
      it("to closed", function() {
        hex.setSide(0, true);
        expect(hex.sides[0]).toBe(true);
      });
    });
  });

  describe("neighbours", function() {
    beforeEach(function() {
      hex       = new HexCell(radius, 0, 2);
      north     = new HexCell(radius, 0, 0);
      northEast = new HexCell(radius, 1, 1);
      southEast = new HexCell(radius, 1, 3);
      south     = new HexCell(radius, 0, 4);
      southWest = new HexCell(radius, 0, 3);
      northWest = new HexCell(radius, 0, 1);
    });

    it("exists as an object", function() {
      expect(hex.neighbours).toNotBe(undefined);
    });

    it("has a north neighbour", function() {
      var coords = hex.neighbours.north;
      expect(north.gridX).toBe(coords[0]);
      expect(north.gridY).toBe(coords[1]);
    });

    it("has a northWest neighbour", function() {
      var coords = hex.neighbours.northWest;
      expect(northWest.gridX).toBe(coords[0]);
      expect(northWest.gridY).toBe(coords[1]);
    });

    it("has a southEast neighbour", function() {
      var coords = hex.neighbours.southEast;
      expect(southEast.gridX).toBe(coords[0]);
      expect(southEast.gridY).toBe(coords[1]);
    });
  });

})