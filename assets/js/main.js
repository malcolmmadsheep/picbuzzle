'use strict';

$(function() {
	var puzzle = new Picpuzzle();
	puzzle.startGame(4);

	window.addEventListener('keydown', handleKeyPress, false);

	function handleKeyPress(evt) {
		var kc = evt.keyCode,
			direction = '';

		// console.log(kc);
		switch (kc) {
			case 38:
				direction = puzzle.DIRECTIONS[0];

				break;
			case 39:
				direction = puzzle.DIRECTIONS[1];
				break;
			case 40:
				direction = puzzle.DIRECTIONS[2];
				break;
			case 37:
				direction = puzzle.DIRECTIONS[3];
				break;
		}
		// console.log(direction);
		if (direction !== '') {
			puzzle.move(direction);
		}

		puzzle.directionsQueue.push(direction);
		console.log(puzzle.directionsQueue);	
	}
});