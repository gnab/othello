(function (context) {

    context.GameView = GameView;

    function GameView(container, game) {
        var self = this;
        
        self.game = game;
        self.cells = createCells(container, game);

        game.onPlayerChanged(updatePlayer);

        updatePlayer();

        function updatePlayer() {
            document.getElementById('player').innerText = game.player === 'w' ? 'White' : 'Black';
        }
    }

    function createCells(container, game) {
        var paper = Raphael(container, "100%", "100%");

        paper.rect(0, 0, 800, 800).attr({
            fill: 'green'
        });

        return game.cells.map(function (cell, index) {
            var coords = getCoordinates(index);

            return new CellView(game, paper, coords.x, coords.y);
        });
    }
    
    function getCoordinates(index) {
        return {
            x: index % 8,
            y: Math.floor(index / 8)
        };
    }

}(this));

