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
		level = 3,
		colil = $('#colil'),
		collWitdth = 0,
		nextPicBtn = $('#nextPic'),
		prevPicBtn = $('#prevPic'),
		collectionItems = $('.collection-item');

	complexity.on('change', setLevel);
	files.on('change', handleFileUploading);
	getImgBtn.on('click', handleLoadingImageFromURL);
	preview.on('load', unblockButton);
	startBtn.on('click', handleStartClick);
	addEventListeners(window, puzzle);
	setCollectionListLength();
	colil.on('wheel', slideCollection);
	nextPicBtn.on('mousedown', slideCollection);
	prevPicBtn.on('mousedown', slideCollection);

	collectionItems.on('click', selectItem);

	$(collectionItems[0]).click();

	function selectItem(evt) {
		var t = evt.target,
			src = t.src;
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				item.removeClass('selected-item');
			}
		}

		$(t).addClass('selected-item');
		preview.prop('src', src);
	}


	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}

	function handleStartClick() {
		puzzle.startGame(level);
	}

	function slideCollection(evt) {
		var original = evt.originalEvent,
			target = evt.target,
			type = evt.type,
			items = $('#items'),
			left = parseInt(items.css('left')),
			delta = 15,
			tWidth = colil.width();

		if (target.localName === 'span') {
			target = $(target).parents('div').get(0);
		}

		if ((original.deltaY < 0 && type === 'wheel') || $(target).get(0) == prevPicBtn.get(0)) {
			if (left < 0) {
				left += delta;
			}
		} else if ((original.deltaY > 0 && type === 'wheel') || $(target).get(0) == nextPicBtn.get(0)) {
			if (collWitdth - Math.abs(left) > tWidth) {
				left -= delta;
			}
		}
		items.css('left', left);
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
			collWitdth = ilength * parseInt($(ichild[0]).width()) + (ilength - 1) * parseInt($(ichild[0]).css('marginRight'));
			items.width(collWitdth);
		}

	}
});