'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		preview = $('#previewpic'),
		getImgBtn = $('#loadpic'),
		imgUrl = $('#imageUrl'),
		files = $('#fromfile'),
		startBtn = $('#startgame'),
		sections = $('section'),
		complexity = $('input[name="complexity"'),
		level = 3;

	complexity.on('change', setLevel);
	files.on('change', handleFileUploading);
	getImgBtn.on('click', handleLoadingImageFromURL);
	preview.on('load', unblockButton);
	startBtn.on('click', handleStartClick);
	addEventListeners(window, puzzle);
	setCollectionListLength();



	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}

	function handleStartClick() {
		puzzle.startGame(level);
	}

	function setLevel(evt) {
		level = parseInt(evt.target.value);
		console.log(level);
	}

	function handleFileUploading(evt) {
		var file = evt.target.files[0],
			reader = new FileReader();

		reader.addEventListener('loadend', function(evt) {
			preview.attr('src', reader.result);
		});

		if (file) {
			blockButton();
			reader.readAsDataURL(file);
		}
	}

	function handleLoadingImageFromURL(evt) {
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
	}

	function blockButton() {
		startBtn.prop('disabled', true).addClass('disabled');
	}

	function unblockButton() {
		startBtn.prop('disabled', false).removeClass('disabled');
	}

	function setCollectionListLength() {
		var items = $('#items'),
			ichild = items.children(),
			ilength = ichild.length;
		if (ilength > 5) {
			var width = ilength * parseInt($(ichild[0]).width()) + (ilength - 1) * parseInt($(ichild[0]).css('marginRight'));
		items.width(width);
		}
		
	}
});