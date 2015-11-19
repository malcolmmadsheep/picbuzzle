'use strict';

$(function() {
	console.dir($('input[type="file"').get(0));
	var puzzle = new Picpuzzle(),
		sample = $('#samplepic'),
		startBtn = $('#startgame'),
		imgUrl = $('#imageUrl'),
		files = $('#fromfile');
	startBtn.on('click', function(evt) {
		alert('suka');
		var source = imgUrl.val();
		if (source !== '') {
			$.ajax('./loadimage.php', {
			method: 'GET',
			data: {
				// url: 'http://www.wallpapervortex.com/ipad_wallpapers/ipad_cat_21114.jpg'
				// url: 'http://st.depositphotos.com/1295648/777/i/950/depositphotos_7779817-Hissing-Cat-face.jpg'
				// url: 'http://localhost/15pic-puzzle/assets/img/p1.png'
				url: source
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
		}
		
	});

	files.on('change', function(evt) {
		// console.log(evt.target.files[0].toString());
		var file = evt.target.files[0],
			reader = new FileReader();
		console.log(file);

		reader.onloadend = function(evt) {
			console.log('loaded');
			
			sample.attr('src', reader.result).on('load', function(evt) {
				puzzle.startGame(4);
				alert('LOADED');
			})
			// puzzle.startGame(3);
		}

		reader.readAsDataURL(file);
	});


	addEventListeners(window, puzzle);

	function addEventListeners(to, toBind) {
		to.addEventListener('keydown', puzzle.handleKeyInput.bind(toBind), false);
		to.addEventListener('touchstart', toBind.handleTouchStart.bind(toBind), false);
		to.addEventListener('touchend', toBind.handleTouchEnd.bind(toBind), false);
	}
});