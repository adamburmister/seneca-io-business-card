describe("HexCell Grid", function() {
  var grid;
  var radius = 5;
  var width = 3;
  var height = 6;

  beforeEach(function() {
    grid = new HexGrid(radius, width, height);
  });

  describe("acessible neighbours for a cell", function() {

    it("0,0 - first offset row", function() {
      var cell = grid.getCell(0,0);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(3);
      expect(Object.keys(neighbours)).toContain('south', 'southEast', 'southWest');
    });

    it("0,1 - first row", function() {
      var cell = grid.getCell(0,1);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(3);
      expect(Object.keys(neighbours)).toContain('south','southEast','northEast');
    });

    it("0,2 - allows for a center cell", function() {
      var cell = grid.getCell(0,2);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(6);
    })

    it("0,3 - first non-top row", function() {
      var cell = grid.getCell(0,3);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(4);
      expect(Object.keys(neighbours)).toContain('north', 'south','southEast','northEast');
    });

    it("0,4 - bottom offset row", function() {
      var cell = grid.getCell(0,4);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(5);
      expect(Object.keys(neighbours)).toContain('north','northEast','southEast','southWest','northWest');
    });

    it("0,5 - bottom row", function() {
      var cell = grid.getCell(0,5);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(2);
      expect(Object.keys(neighbours)).toContain('north','northEast');
    });

    //---

    it("2,0 - first offset row, last column", function() {
      var cell = grid.getCell(2,0);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(2);
      expect(Object.keys(neighbours)).toContain('south','southWest');
    });

    it("2,1 - second row, last column", function() {
      var cell = grid.getCell(2,1);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(5);
      expect(Object.keys(neighbours)).toContain('northWest','southWest','south','southEast','southWest');
    });

    it("2,3 - bottom row", function() {
      var cell = grid.getCell(2,3);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(6);
    });

    it("2,4 - bottom row", function() {
      var cell = grid.getCell(2,4);
      var neighbours = grid.getAccessibleNeighbours(cell);
      // expect(Object.keys(neighbours)).toBe(['north','northWest','southWest']);
      expect(Object.keys(neighbours).length).toBe(3);
      expect(Object.keys(neighbours)).toContain('north','northWest','southWest');
    });

    it("2,5 - bottom row", function() {
      var cell = grid.getCell(2,5);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(3);
      expect(Object.keys(neighbours)).toContain('north','northWest','northEast');
    });

    //---

    it("1,5 - bottom row, middle cell", function() {
      var cell = grid.getCell(1,5);
      var neighbours = grid.getAccessibleNeighbours(cell);
      expect(Object.keys(neighbours).length).toBe(3);
      expect(Object.keys(neighbours)).toContain('north','northWest','southWest');
    });

  });

})