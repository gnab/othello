describe('Game', function () {

    it('should create board of 64 cells', function () {
        expect(game.cells.length).toBe(64);
    });

    it('should initialize cells with two black and two white cells in middle', function () {
        expect(game.getCellPlayer(3, 3)).toBe('b');
        expect(game.getCellPlayer(4, 4)).toBe('b');
        expect(game.getCellPlayer(3, 4)).toBe('w');
        expect(game.getCellPlayer(4, 3)).toBe('w');
    });

    it('should allow first white move to cell (2,3)', function () {
        expect(game.isValidMove(2, 3)).toBe(true);
    });

    it('should not allow first white move to cell (4,2)', function () {
        expect(game.isValidMove(4, 2)).toBe(false);
    });

    var game;

    beforeEach(function () {
        game = new Game();
    });

});