'use strict';

function Picpuzzle() {}

(function() {
	Picpuzzle.prototype.CANVAS_WIDTH = 512;
	Picpuzzle.prototype.CANVAS_HEIGHT = 512;
	Picpuzzle.prototype.CELL_WIDTH = 0;
	Picpuzzle.prototype.CELL_HEIGHT = 0;
	Picpuzzle.prototype.TWEEN_DURATION = 150;
	Picpuzzle.prototype.DIRECTIONS = ['up', 'right', 'down', 'left'];
	Picpuzzle.prototype.imgSource = '';
	Picpuzzle.prototype.context = null;
	Picpuzzle.prototype.field = [];
	Picpuzzle.prototype.rows = -1;
	Picpuzzle.prototype.cols = -1;
	Picpuzzle.prototype.isMoving = false;
	Picpuzzle.prototype.directionsQueue = [];

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
		this.rows = this.cols = parseInt(cellCount);
		this.CELL_WIDTH = this.CELL_HEIGHT = Math.floor(this.CANVAS_WIDTH / cellCount);
		this.field.length = this.rows * this.cols;
		this.setImageSource(imgSource);

		this.setupCanvas();
		this.setupField();
		this.draw();
		// this.showField();
	};

	Picpuzzle.prototype.setupField = function() {
		this.imgSource = this.resize(this.imgSource);
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				var index = this.getIndex(i, j);
				var x = j * this.CELL_WIDTH,
					y = i * this.CELL_HEIGHT,
					image = new Image();
				image.src = this.imgSource;
				if (index === this.field.length - 1) {
					image = null;
				}
				this.field[index] = new ImageCell(index, x, y, x, y, this.CELL_WIDTH, this.CELL_HEIGHT, image);
			}
		}
		// console.log(this.field);
		this.shuffle();
		// console.log(this.field);
	};

	Picpuzzle.prototype.draw = function() {
		var index = -1,
			cell = null,
			that = this;
		// this.context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		this.context.canvas.width = this.context.canvas.width;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				index = this.getIndex(i, j);
				cell = this.field[index];
				if (cell.image !== null) {
					that.context.drawImage(cell.image, cell.sx, cell.sy, cell.width, cell.height, cell.coords.x, cell.coords.y, cell.width, cell.height);
				}
			}
		}
	}

	Picpuzzle.prototype.shuffle = function() {
		var length = this.field.length,
			field = this.field;
		for (var i = 0; i < length; i++) {
			var newIndex = Math.floor(Math.random() * i);
			this.swapCells(i, newIndex);
		}
	}

	Picpuzzle.prototype.showField = function() {
		var index = -1;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				index = this.getIndex(i, j);
			}
		}
	}

	Picpuzzle.prototype.resize = function(source) { // source - string value of image source
		// console.log(source);
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

	Picpuzzle.prototype.move = function(direction) {
			var index = this.getEmptyCell(),
				length = this.field.length,
				newIndex = -1;

			if (direction === this.DIRECTIONS[0] && // up
				!(index >= length - this.cols && index < length)) {
				newIndex = index + this.cols;
				this.moveCell(index, newIndex);
				return;
			}

			if (direction === this.DIRECTIONS[1] && // right
				(index % this.rows !== 0)) {
				newIndex = index - 1;
				this.moveCell(index, newIndex);
				return;
			}

			if (direction === this.DIRECTIONS[2] && // down
				!(index >= 0 && index < this.cols)) {
				newIndex = index - this.cols;
				this.moveCell(index, newIndex);
				return;
			}

			if (direction === this.DIRECTIONS[3] && // left
				(index % this.rows !== this.cols - 1)) {
				newIndex = index + 1;
				this.moveCell(index, newIndex);
				return;
			}
		}
		// i - index of empty cell, j - filled cell
	Picpuzzle.prototype.moveCell = function(i, j) {
		this.tweenCell(i, j);
		// this.swapCells(i, j);
		// this.draw();
		if (this.check()) {
			console.log('Congratulations!')
		}

	}

	Picpuzzle.prototype.check = function() {
		var field = this.field,
			length = field.length,
			result = true;
		for (var i = 0; i < length; i++) {
			if (i !== field[i].index) {
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
	}

	Picpuzzle.prototype.getEmptyCell = function() {
		var field = this.field,
			length = field.length;
		for (var i = 0; i < length; i++) {
			if (field[i].index === length - 1) {
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
			deltaMove = this.CELL_WIDTH / this.TWEEN_DURATION,
			animation = null,
			puzzle = this;
		if (!this.isMoving) {
			if (dX > 0) {
				// console.log('dX > 0', dX);
				animation = setInterval(function() {
					dX -= deltaMove;
					f[j].coords.x = f[j].coords.x + deltaMove;
					// console.log('new c', f[j].coords.x);
					puzzle.draw();
					if (dX <= 0) {
						clearInterval(animation);
						puzzle.swapCells(i, j);
						puzzle.isMoving = false;
						// console.log('dX > 0 STOP');
					}
				}, 1);
			} else if (dX < 0) {
				// console.log('dX < 0');

				animation = setInterval(function() {
					dX += deltaMove;
					f[j].coords.x = f[j].coords.x - deltaMove;
					// console.log('new c', f[j].coords.x);
					puzzle.draw();
					if (dX >= 0) {
						clearInterval(animation);
						puzzle.swapCells(i, j);
						puzzle.isMoving = false;
						// console.log('dX > 0 STOP');
					}
				}, 1);
			}

			if (dY > 0) {
				// console.log('dY > 0');
				animation = setInterval(function() {
					dY -= deltaMove;
					f[j].coords.y = f[j].coords.y + deltaMove;
					// console.log('new c', f[j].coords.y);
					puzzle.draw();
					if (dY <= 0) {
						clearInterval(animation);
						puzzle.swapCells(i, j);
						puzzle.isMoving = false;
						// console.log('dX > 0 STOP');
					}
				}, 1);
			} else if (dY < 0) {
				// console.log('dY < 0');
				animation = setInterval(function() {
					dY += deltaMove;
					f[j].coords.y = f[j].coords.y - deltaMove;
					// console.log('new c', f[j].coords.y);
					puzzle.draw();
					if (dY >= 0) {
						clearInterval(animation);
						puzzle.swapCells(i, j);
						puzzle.isMoving = false;
						// console.log('dX > 0 STOP');
					}
				}, 1);
			}
			this.isMoving = true;
		}
		// setTimeout(function() {
		// 	puzzle.swapCells(i, j);
		// }, puzzle.TWEEN_DURATION * 5);
	}

	Picpuzzle.prototype.getIndex = function(i, j) {
		return i * this.rows + j;
	}

	Picpuzzle.prototype.getCoordsById = function(id) {
		var coords = {};
		coords.x = (id % this.cols) * this.CELL_WIDTH;
		coords.y = (Math.floor((id - (id % this.cols)) / this.rows)) * this.CELL_HEIGHT;

		return coords;
	}
})();

// TODO: finish directionsQueue
// TODO: deal with animating moving