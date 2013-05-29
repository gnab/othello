(function (context) {

    context.Game = Game;

    function Game() {
        var self = this;

        self.cells = createCells(self);
        self.player = 'w';

        self.subscribers = {
            'cellUpdated': [],
            'playerChanged': []
        };
    }

    Game.prototype.endGame = function () {
        var self = this,
            wPlayerCellCount = self.cells.filter(playerComparer('w')).length,
            bPlayerCellCount = self.cells.filter(playerComparer('b')).length,
            statusElement = document.getElementById('status');

        if (wPlayerCellCount === bPlayerCellCount) {
            statusElement.innerText = "It's a tie!";
        }
        else if (wPlayerCellCount > bPlayerCellCount) {
            statusElement.innerText = "White wins!";
        }
        else if (wPlayerCellCount < bPlayerCellCount) {
            statusElement.innerText = "Black wins!";
        }

        function playerComparer(player) {
            return function (cell) {
                return cell.player === player;
            }
        }
    };

    Game.prototype.onCellUpdated = function (callback) {
        var self = this;

        self.subscribers['cellUpdated'].push(callback);
    };

    Game.prototype.triggerCellUpdated = function (cell) {
        var self = this;

        self.subscribers['cellUpdated'].forEach(function (subscriber) {
            subscriber.call(undefined, cell.x, cell.y);
        });
    };

    Game.prototype.onPlayerChanged = function (callback) {
        var self = this;

        self.subscribers['playerChanged'].push(callback);
    };

    Game.prototype.triggerPlayerChanged = function (player) {
        var self = this;

        self.subscribers['playerChanged'].forEach(function (subscriber) {
            subscriber.call(undefined, player);
        });
    };

    Game.prototype.swapPlayer = function () {
        var self = this;

        self.player = self.player === 'w' ? 'b' : 'w';
        self.triggerPlayerChanged(self.player);
    };

    Game.prototype.isCellOccupied = function (x, y) {
        var self = this;

        return self.cells[getIndex(x, y)].player !== null;
    };

    Game.prototype.occupyCell = function (x, y) {
        var self = this,
            moves;

        if (self.isCellOccupied(x, y)) {
            return;
        }

        var relatedMoves = getValidMoves(self.cells, self.player).filter(function (move) {
            return move.targetCell.x === x && move.targetCell.y === y;
        });

        self.cells[getIndex(x, y)].player = self.player;

        relatedMoves.forEach(function (move) {
            move.opponentCells.forEach(function (cell) {
                cell.player = self.player;
                self.triggerCellUpdated(cell);
            });
        });

        self.swapPlayer();

        var validMoves = getValidMoves(self.cells, self.player);

        if (validMoves.length === 0) {
            self.endGame();
        }
    };

    Game.prototype.isValidMove = function (x, y) {
        var self = this,
            validMoves = getValidMoves(self.cells, self.player);

        return validMoves.some(function (move) {
            return move.targetCell.x === x && move.targetCell.y === y;
        });
    };

    function getValidMoves(cells, player) {
        return cells.filter(belongingToPlayer)
                    .map(cellsInAllDirections)
                    .reduce(concat)
                    .map(partitionByPlayer)
                    .filter(oneOrMoreOpponentCellsThenEmpty)
                    .map(toObject);

        function belongingToPlayer(cell) { return cell.player === player; }
        function cellsInAllDirections(cell) {
            var cellLists = [];

            [-1, 0, 1].forEach(function (x) {
                [-1, 0, 1].forEach(function (y) {
                    var cells = [];
                    
                    if (x === 0 && y === 0) {
                        return;
                    }
                    
                    var coord = { x: cell.x, y: cell.y };

                    while (onBoard(coord)) {
                        cells.push(cellAtCoord(coord));
                        coord = { x: coord.x + x, y: coord.y + y };
                    }

                    cellLists.push(cells);
                });
            });
            
            return cellLists;

            function onBoard(coord) { return inRange(coord.x) && inRange(coord.y); }
            function inRange(n) { return n >= 0 && n < 8; }
            function cellAtCoord(coord) { return cells[getIndex(coord.x, coord.y)]; }
        }
        function concat(listA, listB) { return listA.concat(listB); }
        function partitionByPlayer(list) {
            var current = [list[0]], partitions = [current], i = 1;

            while (i < list.length) {
                if (list[i].player === current[0].player) {
                    current.push(list[i]);
                }
                else {
                    current = [list[i]];
                    partitions.push(current);
                }
                i++;
            }

            return partitions;
        }
        function oneOrMoreOpponentCellsThenEmpty(partitions) {
            var opponent = player === 'b' ? 'w' : 'b';

            return partitions.length >= 3 &&
                partitions[1][0].player === opponent &&
                partitions[2][0].player === null;
        }
        function toObject(partitions) {
            return {
                originCell: partitions[0][0],
                opponentCells: partitions[1],
                targetCell: partitions[2][0]
            }
        }
    }

    Game.prototype.getCellPlayer = function (x, y) {
        var self = this;

        return self.cells[getIndex(x, y)].player;
    };

    function createCells(game) {
        var cells = [],
            i;

        for (i = 0; i < 64; i++) {
            cells.push({
                player: null,
                x: i % 8,
                y: Math.floor(i / 8)
            });
        }

        cells[getIndex(3, 3)].player = 'b';
        cells[getIndex(4, 4)].player = 'b';
        cells[getIndex(3, 4)].player = 'w';
        cells[getIndex(4, 3)].player = 'w';

        return cells;
    }

    function getIndex(x, y) {
        return x + 8 * y;
    }

}(this));