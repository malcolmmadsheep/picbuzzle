'use strict';

function Picpuzzle() {}

function ImageCell(id, sx, sy, x, y, w, h, image) {
	this.id = id;
	this.coords = {};
	this.coords.x = x;
	this.coords.y = y;
	this.sx = sx;
	this.sy = sy;
	this.width = w;
	this.height = h;
	this.image = image;
};

(function() {
	Picpuzzle.prototype.CANVAS_WIDTH = 512;
	Picpuzzle.prototype.CANVAS_HEIGHT = 512;
	Picpuzzle.prototype.CELL_WIDTH = 0;
	Picpuzzle.prototype.CELL_HEIGHT = 0;
	Picpuzzle.prototype.TWEEN_DURATION = 25;
	Picpuzzle.prototype.DIRECTIONS = ['up', 'right', 'down', 'left'];
	Picpuzzle.prototype.swapCount = 0;
	Picpuzzle.prototype.imgSource = '';
	Picpuzzle.prototype.context = null;
	Picpuzzle.prototype.field = [];
	Picpuzzle.prototype.rows = -1;
	Picpuzzle.prototype.cols = -1;
	Picpuzzle.prototype.isMoving = false;
	Picpuzzle.prototype.isShuffling = false;
	Picpuzzle.prototype.directionsQueue = [];
	Picpuzzle.prototype.startTouchCoords = {};

	Picpuzzle.prototype.startGame = function(cellCount) {
		this.init(cellCount);
	};

	Picpuzzle.prototype.setupCanvas = function() {
		var canvas = document.createElement('canvas');
		canvas.id = 'puzzle';
		canvas.width = this.CANVAS_WIDTH;
		canvas.height = this.CANVAS_HEIGHT;
		this.context = canvas.getContext('2d');
		document.body.appendChild(canvas);
	};

	Picpuzzle.prototype.init = function(cellCount, imgSource) {
		if (window.innerWidth < this.CANVAS_WIDTH + 100) {
			this.CANVAS_WIDTH = this.CANVAS_HEIGHT = window.innerWidth - 20;
		}
		this.rows = this.cols = parseInt(cellCount);
		this.CELL_WIDTH = this.CELL_HEIGHT = Math.floor(this.CANVAS_WIDTH / cellCount);
		this.field.length = this.rows * this.cols;
		this.swapCount = 0;
		this.setImageSource(imgSource);

		this.setupCanvas();
		this.setupField();
		this.draw();
	};

	Picpuzzle.prototype.setupField = function() {
		this.imgSource = this.resize(this.imgSource);
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				var id = this.getId(i, j);
				var x = j * this.CELL_WIDTH,
					y = i * this.CELL_HEIGHT,
					image = new Image();
				image.src = this.imgSource;
				if (id === this.field.length - 1) {
					image = null;
				}
				this.field[id] = new ImageCell(id, x, y, x, y, this.CELL_WIDTH, this.CELL_HEIGHT, image);
			}
		}
		this.shuffle();
	};

	Picpuzzle.prototype.draw = function() {
		var id = -1,
			cell = null,
			that = this;
		this.context.canvas.width = this.context.canvas.width;
		this.context.fillStyle = '#fff';
		this.context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				id = this.getId(i, j);
				cell = this.field[id];
				if (cell.image !== null) {
					that.context.drawImage(cell.image, cell.sx, cell.sy, cell.width, cell.height, cell.coords.x, cell.coords.y, cell.width, cell.height);
				}
			}
		}
	}

	Picpuzzle.prototype.shuffle = function() {
		var length = this.field.length,
			field = this.field;
		this.isShuffling = true;
		for (var i = 0; i < length; i++) {
			var newIndex = Math.floor(Math.random() * i);
			this.swapCells(i, newIndex);
		}
		this.isShuffling = false;
	}

	Picpuzzle.prototype.showField = function() {
		var index = -1;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				index = this.getId(i, j);
			}
		}
	}

	Picpuzzle.prototype.resize = function(source) { // source - string value of image source
		var canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			image = new Image();
		image.src = source;
		canvas.width = this.CANVAS_WIDTH;
		canvas.height = this.CANVAS_HEIGHT;
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

		return canvas.toDataURL();
	}

	Picpuzzle.prototype.setImageSource = function(source) {
		this.imgSource = (typeof source === 'undefined' || source === '') ? $('#samplepic').get(0).src : source;
	}

	Picpuzzle.prototype.run = function() {
		var id = this.getEmptyCell(),
			length = this.field.length,
			fromCellId = -1;

		if (!this.isMoving && this.directionsQueue.length !== 0) {
			var direction = this.getNextDirection();

			if (direction === this.DIRECTIONS[0] && // up
				!(id >= length - this.cols && id < length)) {
				fromCellId = id + this.cols;
				this.tweenCell(id, fromCellId);
			} else if (direction === this.DIRECTIONS[1] && // right
				(id % this.rows !== 0)) {
				fromCellId = id - 1;
				this.tweenCell(id, fromCellId);
			} else if (direction === this.DIRECTIONS[2] && // down
				!(id >= 0 && id < this.cols)) {
				fromCellId = id - this.cols;
				this.tweenCell(id, fromCellId);
			} else if (direction === this.DIRECTIONS[3] && // left
				(id % this.rows !== this.cols - 1)) {
				fromCellId = id + 1;
				this.tweenCell(id, fromCellId);
			} else {
				this.dequeueDirection();
				this.run();
			}
		}
	}

	Picpuzzle.prototype.move = function(direction) {
		this.enqueueDirection(direction);
		this.run();
	}

	Picpuzzle.prototype.check = function() {
		var field = this.field,
			length = field.length,
			result = true;
		for (var i = 0; i < length; i++) {
			if (i !== field[i].id) {
				return false;
			}
		}

		return true;
	}

	Picpuzzle.prototype.swapCells = function(i, j) {
		var temp = this.field[i];

		this.field[i].coords = this.getCoordsById(j);
		this.field[j].coords = this.getCoordsById(i);

		this.field[i] = this.field[j];
		this.field[j] = temp;

		this.swapEnding();
	}

	Picpuzzle.prototype.swapEnding = function() {
		this.directionsQueue.pop();
		this.isMoving = false;
		this.draw();
		this.run();
		if (!this.isShuffling && this.check()) {
			console.log('Congratulations!')
		}
	}

	Picpuzzle.prototype.getEmptyCell = function() {
		var field = this.field,
			length = field.length;
		for (var i = 0; i < length; i++) {
			if (field[i].id === length - 1) {
				return i;
			}
		}
	}

	Picpuzzle.prototype.tweenCell = function(i, j) {
		var f = this.field,
			ec = f[i].coords,
			fc = f[j].coords,
			dX = ec.x - fc.x,
			dY = ec.y - fc.y,
			deltaMove = Math.round(this.CELL_WIDTH / this.TWEEN_DURATION * 100) / 100,
			animation = null,
			puzzle = this,
			data = {
				deltaM: deltaMove,
				to: i,
				from: j,
				coord: 'x',
				dV: Math.abs(dX),
				puzzle: puzzle
			};

		if (!this.isMoving) {
			if (dX < 0) {
				data.deltaM = -deltaMove;
			} else if (dX === 0) {
				data.coord = 'y';
				data.dV = Math.abs(dY);
			}
			if (dY < 0) {
				data.deltaM = -deltaMove;
			}
			this.animate(data);
		}
	}

	Picpuzzle.prototype.animate = function(data) {
		var f = data.puzzle.field,
			dM = Math.abs(data.deltaM),
			animation = setInterval(function() {
				data.dV -= dM;
				f[data.from].coords[data.coord] = f[data.from].coords[data.coord] + data.deltaM;
				data.puzzle.draw();
				if (data.dV <= 0) {
					clearInterval(animation);
					data.puzzle.swapCells(data.to, data.from);
				}
			}, 1);
		this.isMoving = true;
	}

	// return cell id by row and col values
	Picpuzzle.prototype.getId = function(i, j) {
		return i * this.rows + j;
	}

	// return coordinates of cell by it's id
	Picpuzzle.prototype.getCoordsById = function(id) {
		var coords = {};
		coords.x = (id % this.cols) * this.CELL_WIDTH;
		coords.y = (Math.floor((id - (id % this.cols)) / this.rows)) * this.CELL_HEIGHT;

		return coords;
	}

	// Add direction to beggining of directionsQueue
	Picpuzzle.prototype.enqueueDirection = function(direction) {
		this.directionsQueue.unshift(direction);
	}

	// return and remove last element of directionsQueue
	Picpuzzle.prototype.dequeueDirection = function() {
		return this.directionsQueue.pop();
	}

	// return next direction from directionsQueue
	Picpuzzle.prototype.getNextDirection = function() {
		var l = this.directionsQueue.length;

		return this.directionsQueue[l - 1];
	}

	// Handle keyboard events
	Picpuzzle.prototype.handleKeyInput = function(evt) {
		var kc = evt.keyCode,
			direction = '';
		switch (kc) {
			case 38:
				direction = this.DIRECTIONS[0];
				break;
			case 39:
				direction = this.DIRECTIONS[1];
				break;
			case 40:
				direction = this.DIRECTIONS[2];
				break;
			case 37:
				direction = this.DIRECTIONS[3];
				break;
		}
		if (direction !== '') {
			this.move(direction);
		}
	}

	// handle finger touch start
	Picpuzzle.prototype.handleTouchStart = function(evt) {
		// evt.preventDefault();
		var c = evt.changedTouches[0];
		this.startTouchCoords.x = c.screenX;
		this.startTouchCoords.y = c.screenY;
	}

	// handle finger touch end
	Picpuzzle.prototype.handleTouchEnd = function(evt) {
		var c = evt.changedTouches[0],
			endCoords = {
				x: c.screenX,
				y: c.screenY
			},
			dX = this.startTouchCoords.x - endCoords.x,
			dY = this.startTouchCoords.y - endCoords.y,
			direction = '';
		if (Math.abs(dX) > Math.abs(dY)) {
			if (dX > 0) {
				direction = this.DIRECTIONS[3]
			} else if (dX < 0) {
				direction = this.DIRECTIONS[1];
			}
		} else {
			if (dY > 0) {
				direction = this.DIRECTIONS[0];
			} else if (dY < 0) {
				direction = this.DIRECTIONS[2];
			}
		}
		if (direction !== '') {
			this.move(direction);
		}
	}
})();