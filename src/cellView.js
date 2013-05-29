(function (context) {

    context.CellView = CellView;

    function CellView(game, paper, x, y) {
        var self = this;

        self.game = game;
        self.x = x;
        self.y = y;

        self.element = paper.rect(self.x * 100, self.y * 100, 100, 100).attr({
            fill: 'transparent',
            stroke: "#050",
            "stroke-width": 3
        });

        self.piece = paper.circle(self.x * 100 + 50, self.y * 100 + 50, 40).attr({
            fill: getPieceColor(self.game.getCellPlayer(x, y)),
            stroke: getPieceBorderColor(self.game.getCellPlayer(x, y)),
            'stroke-width': 8
        });

        self.element.click(handleClick);
        self.piece.click(handleClick);

        game.onCellUpdated(function (x, y) {
            if (self.x === x && self.y === y) {
                updateCellColor();
            }
        });

        function handleClick() {
            if (self.game.isCellOccupied(self.x, self.y)) {
                return
            }
            if (!self.game.isValidMove(self.x, self.y)) {
                return;
            }

            self.game.occupyCell(self.x, self.y);
            updateCellColor();
        }

        function updateCellColor() {
            self.piece.attr('fill', getPieceColor(self.game.getCellPlayer(x, y)));
            self.piece.attr('stroke', getPieceBorderColor(self.game.getCellPlayer(x, y)));
        }
    }

    function getPieceColor(player) {
        if (player === 'w') {
            return 'r(0.5, 0.5)#fff-#bbb';
        }
        
        if (player === 'b') {
            return 'r(0.5, 0.5)#666-#111';
        }
        
        return 'transparent';
    }

    function getPieceBorderColor(player) {
        if (player === 'w') {
            return '#aaa';
        }

        if (player === 'b') {
            return '#222';
        }

        return 'none';
    }

}(this));