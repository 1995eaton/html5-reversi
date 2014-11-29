var Game = (function() {

  var directions = [
    [1, 0], [-1, 0], [0, -1], [0, 1],
    [-1, -1], [1, -1], [1, 1], [-1, 1]
  ];
  var data = [];
  var colors = ['white', 'black'];
  var player = 0;

  var place = function(x, y) {
    player ^= 1;
    data[y][x] = player;
    Board.placePiece(x, y, colors[player]);
  };

  var canMove = function(x, y, dx, dy) {
    if (data[y + dy] === void 0 || data[y + dy][x + dx] === void 0)
      return false;
    if (data[y + dy][x + dx] === player) {
      for (var _x = x + 2 * dx, _y = y + 2 * dy;; _x += dx, _y += dy) {
        if (data[_y] === void 0 || data[_y][_x] === void 0 ||
            data[_y][_x] === -1)
          return false;
        if (data[_y][_x] === player ^ 1)
          return true;
      }
    }
  };

  var move = function(x, y) {
    var flip = function(dx, dy) {
      if (data[y + dy] === void 0 || data[y + dy][x + dx] === void 0)
        return false;
      for (var _x = x + dx, _y = y + dy;; _x += dx, _y += dy) {
        if (data[_y][_x] === player ^ 1)
          return true;
        data[_y][_x] = player ^ 1;
        Board.placePiece(_x, _y, colors[player ^ 1]);
      }
    };
    directions.forEach(function(e) {
      if (canMove(x, y, e[0], e[1]))
        flip(e[0], e[1]);
    });
  };

  var isValidMove = function(x, y) {
    if (data[y][x] !== -1)
      return false;
    var move = canMove.bind(this, x, y);
    for (var i = 0; i < directions.length; i++) {
      if (move.apply(this, directions[i]))
        return true;
    }
    return false;
  };

  var initData = function() {
    for (var i = 0; i < 8; i++) {
      data[i] = [];
      for (var j = 0; j < 8; j++) {
        data[i].push(-1);
      }
    }
  };

  var createHints = function() {
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        if (isValidMove(x, y)) {
          Board.placeHint(x, y);
        } else if (data[y][x] === -1) {
          Board.clearCell(x, y);
        }
      }
    }
  };

  var onClick = function(x, y) {
    if (!isValidMove(x, y))
      return;
    move(x, y);
    place(x, y);
    createHints();
  };

  return {
    init: function(size) {
      Board.init(size, onClick);
      initData();
      place(3, 3); place(4, 3);
      place(4, 4); place(3, 4);
      createHints();
    }
  };

})();
