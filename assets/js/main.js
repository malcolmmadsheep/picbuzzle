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
		collWidth = 0,
		nextPicBtn = $('#nextPic'),
		prevPicBtn = $('#prevPic'),
		collectionItems = $('.collection-item'),
		startX = 0,
		trb = $('#toResultsBtn'),
		againBtn = $('#againBtn'),
		startPos = $(collectionItems[0]).get(0).x; // 
	setCollectionListLength();
	complexity.on('change', setLevel);
	files.on('change', handleFileUploading);
	getImgBtn.on('click', handleLoadingImageFromURL);
	preview.on('load', unblockButton);
	startBtn.on('click', handleStartClick);
	addEventListeners(window, puzzle);

	colil.on('wheel', slideCollection);
	nextPicBtn.on('mousedown', changeSelectedItem);
	prevPicBtn.on('mousedown', changeSelectedItem);

	collectionItems.on('click', selectItem);

	trb.on('click', puzzle.handleToResultBtnClick.bind(puzzle));
	againBtn.on('click', puzzle.handleAgainBtnClick.bind(puzzle));

	$(collectionItems[0]).click();

	colil.on('touchstart', slideCollectionTouch);
	colil.on('touchend', slideCollectionTouch);

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

	function slideCollectionTouch(evt) {
		var type = evt.type,
			original = evt.originalEvent.changedTouches[0];
		if (type === "touchstart") {
			startX = original.screenX;
		} else if (type === "touchend") {
			var deltaX = original.screenX - startX,
				items = $('#items'),
				left = parseInt(items.css('left')),
				delta = 60,
				tWidth = colil.width();

			if (deltaX > 0 && left < 0) {
				left += delta;
			} else if (deltaX < 0 && (collWidth - Math.abs(left)) > tWidth) {
				left -= delta;
			}

			items.css('left', left);
		}
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

		if (type !== 'wheel') {
			delta = 50;
		}

		if (original.deltaY < 0 && type === 'wheel' && left < 0) {
			left += delta;
		} else if ((original.deltaY > 0 && type === 'wheel')) {
			if (collWidth - Math.abs(left) > tWidth) {
				left -= delta;
			}
		}
		items.css('left', left);
	}

	function changeSelectedItem(evt) {
		var id = getSelectedItemId(),
			target = evt.target,
			items = $('#items'),
			left = parseInt(items.css('left')),
			delta = 0;
		if (target.tagName.toLowerCase() === 'span') {
			target = $(target).parents('div').get(0);
		}

		var item = $(collectionItems[id]),
			delta = 0;
		item.removeClass('selected-item');
		if (target.id === 'nextPic' && id + 1 < collectionItems.length) {
			id++;
			left -= (item.outerWidth() + parseInt(item.parents('li').css('marginRight')));
		} else if (target.id === 'prevPic' && id > 0) {
			id--;
			left += (item.outerWidth() + parseInt(item.parents('li').css('marginRight')));
		}

		item = $(collectionItems[id])
		var src = item.prop('src'),
			tX = item.get(0).x;
		// console.log(tX - startPos);

		$(collectionItems[id]).addClass('selected-item');
		preview.prop('src', src);
		items.animate({
			'left': left
		}, 500, function() {
			console.log('animated');
		});

		console.log(colil.css('left'));

	}

	function setLevel(evt) {
		level = parseInt(evt.target.value);
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

	function getSelectedItemId() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				return i;
			}
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
			for (var i = 0; i < ilength; i++) {
				var item = $(ichild.get(i));
				collWidth += item.outerWidth() + parseInt(item.css('marginRight'));
			}
			items.width(collWidth);
		}

	}
});