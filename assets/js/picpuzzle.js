'use strict';

function Picpuzzle() {}

(function() {
	Picpuzzle.prototype.CANVAS_WIDTH = 512;
	Picpuzzle.prototype.CANVAS_HEIGHT = 512;
	Picpuzzle.prototype.imgSource = null;
	Picpuzzle.prototype.context = null;
	Picpuzzle.prototype.field = [];
	Picpuzzle.prototype.rows = -1;
	Picpuzzle.prototype.col = -1;

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

 	Picpuzzle.prototype.init = function(cellCount) {
 		this.row = parseInt(cellCount);
 		this.col = parseInt(cellCount);
 		this.field.length = this.row * this.col;
 		this.imgSource = $('#puzzlepic').get(0).src;

 		this.setupCanvas();
 		this.createField();
 	};

 	Picpuzzle.prototype.createField = function() {
 		
 	};
})();