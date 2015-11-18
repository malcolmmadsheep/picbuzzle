'use strict';

function Picpuzzle() {}

(function() {
	Picpuzzle.prototype.CANVAS_WIDTH = 512;
	Picpuzzle.prototype.CANVAS_HEIGHT = 512;
	Picpuzzle.prototype.imgSource = '';
	Picpuzzle.prototype.context = null;
	Picpuzzle.prototype.field = [];
	Picpuzzle.prototype.rows = -1;
	Picpuzzle.prototype.cols = -1;
	Picpuzzle.prototype.cellW = -1;
	Picpuzzle.prototype.cellH = -1;

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
		this.cellW = this.cellH = Math.floor(this.CANVAS_WIDTH / cellCount);
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
				var index = i * this.rows + j;
				var x = j * this.cellW,
					y = i * this.cellH,
					image = new Image();
				image.src = this.imgSource;
				var k = index;
				if (index === this.field.length - 1) {
					k = -1;
					image = null;
				}
				this.field[index] = new ImageCell(k, x, y, this.cellW, this.cellH, image);
			}
		}

		this.shuffle();
	};

	Picpuzzle.prototype.draw = function() {
		var index = -1,
			cell = null,
			that = this;
		this.context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				index = i * this.rows + j;
				cell = this.field[index];
				if (cell.index !== -1) {
					that.context.drawImage(cell.image, cell.x, cell.y, cell.width, cell.height, j * cell.width, i * cell.height, cell.width, cell.height);
				}
			}
		}
	}

	Picpuzzle.prototype.shuffle = function() {
		var length = this.field.length,
			field = this.field;
		for (var i = 0; i < length; i++) {
			var newIndex = Math.floor(Math.random() * i),
				temp = field[i];
			field[i] = field[newIndex];
			field[newIndex] = temp;
		}

		field.forEach(function(item) {
			console.log(item);
		});
	}

	Picpuzzle.prototype.showField = function() {
		var index = -1;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				index = i * this.rows + j;
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
})();