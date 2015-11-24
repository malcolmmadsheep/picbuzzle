'use strict';

$(function() {
	var puzzle = new Picpuzzle(),
		level = 3,
		startX = 0,
		collWidth = 0,
		isScrolling = false,
		files = $('#fromfile'),
		sections = $('section'),
		imageURLBox = $('#imageUrl'),
		collectionItemsList = $('#items'),
		previewPicture = $('#previewPicture'),
		imageFailLoadingBox = $('#imageLoadingFail'),
		complexityLevel = $('input[name="complexity"'),
		collectionListItemsWrapper = $('#collectionItemsList'),
		collectionItems = $('.collection-item').children('img'),
		tryAgainButton = $('#tryAgainButton'),
		reshuffleButton = $('#reshuffleButton'),
		startGameButton = $('#startGameButton'),
		goToResultsButton = $('#rageQuitButton'),
		NextPictureButton = $('#nextPictureButton'),
		getImageByURLButton = $('#getImageByURLButton'),
		PreviousPictruveButton = $('#previousPictureButton'),
		helpLabel = $('#helplabel'),
		helpBox = $('#helpbox'),
		helpPicture = $('#helpPicture');

	addActionListeners();
	prepeareWindowForWork();

	function startButtonClick() {
		var source = previewPicture.prop('src');
		puzzle.startGame(level, source);
		helpPicture.prop('src', source);
	}

	function setLevel(evt) {
		level = parseInt(evt.target.value);
	}

	function blockButton() {
		startGameButton.prop('disabled', true).addClass('disabled');
	}

	function unblockButton() {
		startGameButton.prop('disabled', false).removeClass('disabled');
	}

	function makeSelected(item) {
		$(item).addClass('selected-item');
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

	function previewPictureLoadingError(evt) {
		imageURLBox.val('');
		imageFailLoadingBox.css('display', 'block');
		$(this).css('display', 'none');
	}

	function getSelectedItemId() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = collectionItems[i];
			if ($(item).hasClass('selected-item')) {
				return i;
			}
		}
	}

	function deselectCollectionItems() {
		for (var i = 0; i < collectionItems.length; i++) {
			var item = $(collectionItems[i]);
			if (item.hasClass('selected-item')) {
				item.removeClass('selected-item');
			}
		}
	}

	function removeUnactiveSections() {
		puzzle.SECTIONS = $('section');
		for (var i = 0; i < puzzle.SECTIONS.length; i++) {
			puzzle.SECTIONS[i].isActive = true;
		}

		puzzle.setActiveSection('menu');
	}

	function previewPictureLoadingSuccess(evt) {
		var target = $(evt.target);
		if (!target.hasClass('borderedpi')) {
			target.addClass('borderedpi');
		}
		$(this).css('display', 'block');
		imageFailLoadingBox.css('display', 'none');
		unblockButton();
	}

	function handleFileUploading(evt) {
		var file = evt.target.files[0],
			reader = new FileReader();
		deselectCollectionItems();

		reader.addEventListener('loadend', function(evt) {
			previewPicture.attr('src', reader.result);
		});

		if (file) {
			blockButton();
			reader.readAsDataURL(file);
		}
	}

	function getImageByURLButtonClick(evt) {
		var source = imageURLBox.val().trim();
		if (source === '') {
			imageURLBox.val('');
			return;
		}
		blockButton();
		$.ajax('loadimage.php', {
			method: 'GET',
			data: {
				url: source
			},
			success: function(data) {
				if (data.indexOf('[') !== 0) {
					data = data.substr(data.indexOf('['));
				}
				var response = JSON.parse(data);

				previewPicture.attr('src', response[0].data);
			}
		});
		deselectCollectionItems();
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

	function slideCollection(evt) {
		var deltaY = evt.originalEvent.deltaY,
			target = evt.target,
			type = evt.type,
			left = parseInt(collectionItemsList.css('left')),
			delta = 150,
			tWidth = collectionListItemsWrapper.width();

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

	function slideCollectionByTouch(evt) {
		var type = evt.type,
			original = evt.originalEvent.changedTouches[0];
		if (type === "touchstart") {
			startX = original.screenX;
		} else if (type === "touchend") {
			var deltaX = original.screenX - startX,
				left = parseInt(collectionItemsList.css('left')),
				tWidth = collectionListItemsWrapper.width();
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

	function selectItem(evt) {
		var newItem = evt.target,
			prevItemId = getSelectedItemId(),
			newLeft = 0,
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

		if (collWidth - collectionListItemsWrapper.width() < newLeft) {
			newLeft = collWidth - collectionListItemsWrapper.width();
		}

		collectionItemsList.animate({
			'left': -newLeft
		}, 250);

		previewPicture.prop('src', $(newItem).prop('src'));
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
		if (tId === 'nextPictureButton') {
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
		var newItem = $(collectionItems[newId]).get(0);

		makeSelected(newItem);
		previewPicture.prop('src', newItem.src);
		if (offset > collWidth - collectionListItemsWrapper.width()) {
			offset = collWidth - collectionListItemsWrapper.width();
		}
		collectionItemsList.animate({
			'left': -offset
		}, 250);
	}

	function helpLabelClick(evt) {
		var top = parseInt(helpBox.css('top')),
			labelTop = top + helpBox.outerHeight();
		if (top === 0) {
			labelTop = top;
			top = -helpBox.outerHeight();
		} else {
			top = 0;
			labelTop = helpBox.outerHeight();
		}
		helpBox.animate({
			'top': top
		});
		$(this).animate({
			'top': labelTop
		});
		helpBox.isDown = !helpBox.isDown;
	}

	function hideHelpBox(evt) {
		if (helpBox.isDown) {
			helpLabel.click();
		}
	}

	function prepeareWindowForWork() {
		setCollectionListWidth();
		removeUnactiveSections();
		$(collectionItems[0]).click();
	}

	function addActionListeners() {
		complexityLevel.on('change', setLevel);
		files.on('change', handleFileUploading);
		previewPicture.on('error', previewPictureLoadingError);
		previewPicture.on('load', previewPictureLoadingSuccess);
		NextPictureButton.on('mousedown', changeSelectedItem);
		PreviousPictruveButton.on('mousedown', changeSelectedItem);
		startGameButton.on('click', startButtonClick);
		reshuffleButton.on('click', puzzle.shuffle.bind(puzzle));
		getImageByURLButton.on('click', getImageByURLButtonClick);
		tryAgainButton.on('click', puzzle.tryAgainButtonClick.bind(puzzle));
		goToResultsButton.on('click', hideHelpBox);
		goToResultsButton.on('click', puzzle.goToResultsButtonClick.bind(puzzle));
		collectionItems.on('click', selectItem);
		collectionItemsList.on('wheel', slideCollection);
		collectionItemsList.on('touchstart', slideCollectionByTouch);
		collectionItemsList.on('touchend', slideCollectionByTouch);
		helpLabel.on('click', helpLabelClick);
		window.addEventListener('keydown', puzzle.handleKeyInput.bind(puzzle), false);
	}
});