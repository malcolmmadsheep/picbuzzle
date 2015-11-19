'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		sample = $('#samplepic');
	$.ajax('./loadimage.php', {
		method: 'GET',
		data: {
			url: 'http://www.wallpapervortex.com/ipad_wallpapers/ipad_cat_21114.jpg'
			// url: 'http://st.depositphotos.com/1295648/777/i/950/depositphotos_7779817-Hissing-Cat-face.jpg'
			// url: 'http://localhost/15pic-puzzle/assets/img/p1.png'
		},
		success: function(data) {
			var response = JSON.parse(data);
			sample.attr('src', response[0].data).on('load', function(evt) {
				puzzle.startGame(3);
			}).on('error', function(evt) {
				console.log('Picture was not loaded');
			});
		}
	});

	addEventListeners(window, puzzle);

	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}
});