'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		level = 3,
		collWidth = 0,
		startX = 0,
		collectionItemsList = $('#items'),
		previewImage = $('#previewpic'),
		getImageByURLButton = $('#loadpic'),
		imageURLBox = $('#imageUrl'),
		files = $('#fromfile'),
		startGameButton = $('#startgame'),
		sections = $('section'),
		complexity = $('input[name="complexity"'),
		colil = $('#colil'),
		toResultButton = $('#toResultsBtn'),
		againBtn = $('#againBtn'),
		toNextPictureButton = $('#nextPic'),
		toPrevPictruveButton = $('#prevPic'),
		collectionItems = $('.collection-item').children('img'),
		imageFailLoadingBox = $('#imgloadingfail'),
		isScrolling = false;

	setCollectionListWidth();
	complexity.on('change', setLevel);
	files.on('change', handleFileUploading);

	previewImage.on('load', handlePreviewImageSuccessfulLoading);
	previewImage.on('error', handlePreviewImageErrorLoading);

	window.addEventListener('keydown', puzzle.handleKeyInput.bind(puzzle), false);
	window.addEventListener('touchstart', puzzle.handleTouchStart.bind(puzzle), false);
	window.addEventListener('touchend', puzzle.handleTouchEnd.bind(puzzle), false);

	toNextPictureButton.on('mousedown', changeSelectedItem);
	toPrevPictruveButton.on('mousedown', changeSelectedItem);

	startGameButton.on('click', handleStartClick);
	getImageByURLButton.on('click', handleLoadingImageFromURL);
	toResultButton.on('click', puzzle.handleToResultBtnClick.bind(puzzle));
	againBtn.on('click', puzzle.handleAgainBtnClick.bind(puzzle));

	colil.on('wheel', slideCollection);
	colil.on('touchstart', slideCollectionTouch);
	colil.on('touchend', slideCollectionTouch);
	collectionItems.on('click', selectItem);

	$(collectionItems[0]).click();

	function selectItem(evt) {
		var newItem = evt.target,
			prevItemId = getSelectedItemId(),
			newLeft,
			currentItemId = prevItemId,
			countOfElements = collectionItems.length;

		deselectCollectionItems();
		makeSelected(newItem);

		currentItemId = getSelectedItemId();

		if (currentItemId > 1) {
			newLeft = collectionItems.get(currentItemId - 2).offsetLeft;
		} else if (currentItemId === 1) {
			newLeft = collectionItems.get(0).offsetLeft;
		}

		if (collWidth - colil.width() < newLeft) {
			newLeft = collWidth - colil.width();
		}

		collectionItemsList.animate({
			'left': -newLeft
		}, 250);
		previewImage.prop('src', $(newItem).prop('src'));
	}

	function changeSelectedItem(evt) {
		var currentId = getSelectedItemId(),
			t = $(evt.target),
			newId = currentId,
			offset;
		if (!t.is('div')) {
			t = $(t.parents('div').get(0));
		}
		deselectCollectionItems();

		var tId = t.prop('id');
		if (tId === 'nextPic') {
			if (currentId < collectionItems.length - 1) {
				newId = currentId + 1;
				if (newId > 1) {
					offset = $(collectionItems[newId - 2]).get(0).offsetLeft;
				} else if (newId === 1) {
					offset = $(collectionItems[0]).get(0).offsetLeft;
				}
			}
		} else {
			if (currentId > 0) {
				newId = currentId - 1;
				if (newId > 1) {
					offset = $(collectionItems[newId - 2]).get(0).offsetLeft;
				} else if (newId === 1) {
					offset = $(collectionItems[0]).get(0).offsetLeft;
				}
			}
		}
		console.log(newId);
		var newItem = $(collectionItems[newId]).get(0);
		console.log('wtf');

		makeSelected(newItem);
		previewImage.prop('src', newItem.src);
		if (offset > collWidth - colil.width()) {
			offset = collWidth - colil.width();
		}
		collectionItemsList.animate({
			'left': -offset
		}, 500);
		// if (whichButton.tagName.toLowerCase() === 'span') {

		// }
		// var currentItemId = getSelectedItemId(),
		// 	target = evt.target,
		// 	left = parseInt(collectionItemsList.css('left')),
		// 	delta = 0,
		// 	isStart = (currentItemId === 0) ? true : false,
		// 	tWidth = collectionItemsList.outerWidth(),
		// 	aWidth = colil.outerWidth(),
		// 	isEnd = false;
		// if (target.tagName.toLowerCase() === 'span') {
		// 	target = $(target).parents('div').get(0);
		// }

		// var item = $(collectionItems[currentItemId]),
		// 	delta = 0,
		// 	prevOffset = item.get(0).offsetLeft;
		// // console.log(isStart);
		// item.removeClass('selected-item');
		// console.log(currentItemId);
		// if (target.id === 'nextPic') {// && id + 1 < collectionItems.length) {
		// 	// id++;
		// 	selectNextItem(currentItemId);
		// } else if (target.id === 'prevPic') { //} && id > 0) {
		// 	// prevOffset = $(collectionItems[id - 1]).get(0).offsetLeft;
		// 	// id--;
		// 	// if (id !== 0) {
		// 	// 	prevOffset = $(collectionItems[id - 1]).get(0).offsetLeft;
		// 	// }
		// 	selectPreviousItem(currentItemId);
		// }
		// // console.log('offset left', item.get(0).offsetLeft);
		// // console.log(tWidth - prevOffset, '=', aWidth);
		// if (tWidth - prevOffset < aWidth) {
		// 	isEnd = true;
		// }

		// item = $(collectionItems[currentItemId]);
		// var offsetLeft = item.get(0).offsetLeft,
		// 	src = item.prop('src'),
		// 	tX = item.get(0).x;

		// $(collectionItems[currentItemId]).addClass('selected-item');
		// previewImage.prop('src', src);
		// if (!isStart && !isEnd) {
		// 	// console.log('wtf');
		// 	collectionItemsList.animate({
		// 		'left': -prevOffset
		// 	}, 500);
		// }
	}

	// return new offset
	function selectNextItem(currentItemId) {
		console.log('next');
		var item = $(collectionItems[currentItemId]);
		console.log(item);
	}

	// return new offset
	function selectPreviousItem(currentItemId) {
		console.log('previous');
		var item = $(collectionItems[currentItemId]);
		console.log(item);
	}

	function slideCollectionTouch(evt) {
		var type = evt.type,
			original = evt.originalEvent.changedTouches[0];
		if (type === "touchstart") {
			startX = original.screenX;
		} else if (type === "touchend") {
			var deltaX = original.screenX - startX,
				left = parseInt(collectionItemsList.css('left')),
				tWidth = colil.width();
			left += deltaX;

			if (left > 0) {
				left = 0;

			} else if (collWidth - tWidth < Math.abs(left)) {
				left = tWidth - collWidth;
			}

			collectionItemsList.animate({
				'left': left
			}, 350);
		}
	}

	function handleStartClick() {
		puzzle.startGame(level);
	}

	function slideCollection(evt) {
		var deltaY = evt.originalEvent.deltaY,
			target = evt.target,
			type = evt.type,
			left = parseInt(collectionItemsList.css('left')),
			delta = 150,
			tWidth = colil.width();

		if (deltaY < 0 && left < 0) {
			left += delta;
			if (left >= 0) {
				left = 0;
			}
		} else if (deltaY > 0 && (collWidth - Math.abs(left) > tWidth)) {
			left -= delta;
			if (Math.abs(left) > tWidth) {
				left = tWidth - collWidth;
			}
		}

		scrollItemList(left);
	}

	function scrollItemList(offset) {
		if (!isScrolling) {
			isScrolling = true;
			collectionItemsList.animate({
				'left': offset
			}, 300, function() {
				isScrolling = false;
			});
		}
	}

	function setLevel(evt) {
		level = parseInt(evt.target.value);
	}

	function handleFileUploading(evt) {
		var file = evt.target.files[0],
			reader = new FileReader();
		deselectCollectionItems();

		reader.addEventListener('loadend', function(evt) {
			previewImage.attr('src', reader.result);
		});

		if (file) {
			blockButton();
			reader.readAsDataURL(file);
		}
	}

	function handleLoadingImageFromURL(evt) {
		var source = imageURLBox.val().trim();
		if (source === '') {
			imageURLBox.val('');
			return;
		}
		blockButton();
		$.ajax('./loadimage.php', {
			method: 'GET',
			data: {
				url: source
			},
			success: function(data) {
				var response = JSON.parse(data);
				previewImage.attr('src', response[0].data);
			}
		});
		deselectCollectionItems();
	}

	function blockButton() {
		startGameButton.prop('disabled', true).addClass('disabled');
	}

	function unblockButton() {
		startGameButton.prop('disabled', false).removeClass('disabled');
	}

	function setCollectionListWidth() {
		var ichild = collectionItemsList.children().toArray(),
			item = $(ichild[0]),
			defaultWidth = item.outerWidth() + parseInt(item.css('marginRight')),
			i = 1;
		while (defaultWidth === 0) {
			defaultWidth = $(ichild[i]).outerWidth() + parseInt($(ichild[i]).css('marginRight')) / ichild.length;
			i++;
		}
		if (ichild.length > 5) {
			ichild.forEach(function(item) {
				var ow = $(item).outerWidth();
				if (ow === 0) {
					ow = defaultWidth;
				}
				collWidth += ow + parseInt($(item).css('marginRight'));
			});
			collectionItemsList.width(collWidth);
		}
	}

	function handlePreviewImageSuccessfulLoading(evt) {
		var target = $(evt.target);
		if (!target.hasClass('borderedpi')) {
			target.addClass('borderedpi');
		}
		$(this).css('display', 'block');
		imageFailLoadingBox.css('display', 'none');
		unblockButton();
	}

	function handlePreviewImageErrorLoading(evt) {
		imageURLBox.val('');
		imageFailLoadingBox.css('display', 'block');
		$(this).css('display', 'none');
	}

	function deselectCollectionItems() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				item.removeClass('selected-item');
			}
		}
	}

	function getSelectedItemId() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = collectionItems[i];
			if ($(item).hasClass('selected-item')) {
				return i;
			}
		}
	}

	function makeSelected(item) {
		$(item).addClass('selected-item');
	}
});