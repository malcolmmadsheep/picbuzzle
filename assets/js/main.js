'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		preview = $('#previewpic'),
		getImgBtn = $('#loadpic'),
		imgUrl = $('#imageUrl'),
		files = $('#fromfile'),
		startBtn = $('#startgame'),
		sections = $('section');

		document.getElementById('previewpic').onloadstart = function() {
		console.log('loading starg');
	}

	getImgBtn.on('click', function(evt) {
		var source = imgUrl.val();
		if (source !== '') {
			blockButton();
			$.ajax('./loadimage.php', {
				method: 'GET',
				data: {
					url: source
				},
				success: function(data) {

					var response = JSON.parse(data);
					preview.attr('src', response[0].data).on('error', function(evt) {
						console.log('Picture was not loaded');
					});
				}
			});
		}

	});

	files.on('change', function(evt) {
		var file = evt.target.files[0],
			reader = new FileReader();

		reader.addEventListener('loadend', function(evt) {
			console.log('loaded from file');
			preview.attr('src', reader.result);
		});

		if (file) {
			blockButton();
			reader.readAsDataURL(file);
		}

	});

	addEventListeners(window, puzzle);
	preview.on('load', function(evt) {
		// puzzle.startGame(4);
		console.log('loaded');
		startBtn.prop('disabled', false).removeClass('disabled');
	});

	function blockButton() {
		startBtn.prop('disabled', true).addClass('disabled');
	}



	// preview.on('loadstart', function(evt) {
	// 	console.log('loading started');
	// 	startBtn.prop('disabled', true).addClass('disabled');
	// });
	
	// .addEventListener('loadstart', function(evt) {
	// 	console.log('start loading');
	// }, false);


	startBtn.on('click', function(evt) {
		puzzle.startGame(3);
	});


	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}
});