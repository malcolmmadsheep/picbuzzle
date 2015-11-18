'use strict';

$(function() {
	var puzzle = new Picpuzzle();
	puzzle.startGame(4);

	window.addEventListener('keypress', handleKeyPress, false);

	function handleKeyPress(evt) {
		var kc = evt.keyCode,
			direction = 'up';
		evt.preventDefault();

		console.log(kc);
		switch (kc) {
			case 119:
				direction = puzzle.DIRECTIONS[0];
				break;
			case 100:
				direction = puzzle.DIRECTIONS[1];
				break;
			case 115:
				direction = puzzle.DIRECTIONS[2];
				break;
			case 97:
				direction = puzzle.DIRECTIONS[3];
				break;
		}
		console.log(direction);
		puzzle.move(direction);
	}
});