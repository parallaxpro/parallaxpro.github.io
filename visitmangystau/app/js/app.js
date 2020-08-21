document.addEventListener("DOMContentLoaded", function() {

	// document.getElementsByClassName('languages-button').onclick = function() {
	// 	document.getElementsByClassName('languages-list--dropdown').classList.add('show');
	// }

});

$(document).ready(function() {
	
	
	$('.languages-button').on('click', function() {
		var dropdown = $('.languages-list--dropdown');

		if (dropdown.hasClass('show')) {
			closeDropdown(dropdown);
		} else {
			dropdown.addClass('show');
		}
	});
	
	$(document).mouseup(function (e) {
		var container = $('.navigation--right-langs');
		var dropdown = $('.languages-list--dropdown');
		if (container.has(e.target).length === 0){
			closeDropdown(dropdown);
		}
	});

	var block_position;

	$('.navigation--right-search--container').on('click', function() {
		
		var block = $('.navigation--right-search');
		block_position = block.offset().left;

		block.addClass('open');
		block.appendTo('.header-container');

		block.css({
			left: block_position + 'px'
		});

		var position = $('.li-navigation-item').first().offset().left;
		var block_width = block_position - position + 40;

		$('.navigation').fadeOut(200);

		block.animate({
			left: ''+ position +'px',
			width: ''+ block_width +'px',
		}, 100, function() {
			block.addClass('show');
		});		

	});

	$(document).mouseup(function (e) {
		var container = $('.navigation--right-search');
		if (container.has(e.target).length === 0){
			container.removeClass('show');

			$('.navigation').fadeIn(200);

			container.animate({
				left: ''+ block_position +'px',
				width: '40px',
			}, 100, function() {

				setTimeout(function() {
					container.appendTo('.navigation--right-search--container');
					container.removeClass('open');

					container.css({
						left: '',
						width: '',
					});

				}, 450);

			});	
		}
	});

});

function closeDropdown(block) {
	block.addClass('close');
	setTimeout(function() {
		block.removeClass('show');
		block.removeClass('close');
	}, 250);
}