'use strict';

$(function() {
	var puzzle = new Picpuzzle();

	puzzle.startGame(4);
	addEventListeners(window, puzzle);

	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}
});