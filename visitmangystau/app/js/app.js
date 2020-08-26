$(document).ready(function() {

	var mySwiper = new Swiper('.swiper--slider', {
		slidesPerView: 4,
		spaceBetween: 30,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			1200: {
				slidesPerView: 4,
			}
		}
	});

	var mySwiper_1 = new Swiper('.comercial-slider', {
		slidesPerView: 4,
		spaceBetween: 30,
		autoplay: {
			delay: 6000,
			disableOnInteraction: false,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			1200: {
				slidesPerView: 4,
			}
		}
	});

	var mySwiper_2 = new Swiper('.events--slider', {
		slidesPerView: 2,
		spaceBetween: 30,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			1024: {
				slidesPerView: 2,
			},
		}
	});

	var mySwiper_3 = new Swiper('.actual-row', {
		slidesPerView: 4,
		spaceBetween: 30,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
			},
			1024: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
				watchOverflow: true
			}
		}
	});

	$('.swiper-wrapper--animated').viewportChecker({
		classToAdd: 'swiper--animated'
	});
	
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

	/**
	 * Search show and hide system
	 */
	$('.navigation--right-search--container').on('click', function() {
		var block 			= $('.navigation--right-search');
		var main_block 		= $('.navigation--right-search--showed');
		    block_position 	= block.offset().left;

		block.fadeOut(50, function() {
			main_block.addClass('open');
	
			if ($(document).width() > 1200)
				var position 	= $('.li-navigation-item').first().offset().left;
			else
				var position 	= $('.mobile-menu--button').first().offset().left;		

			var block_width = block_position - position + 40;
	
			$('.navigation').fadeOut(200);
	
			main_block.animate({
				width: ''+ block_width +'px',
			}, 100, function() {
				main_block.addClass('show');
			});
		});
	});

	$(document).mouseup(function (e) {
		var block 			= $('.navigation--right-search');
		var container 		= $('.navigation--right-search--showed');
		var results_block	= $('.search-results-container');
		
		if (container.has(e.target).length === 0 && container.hasClass('open')) {
			
			closeDropdown(results_block);
			
			setTimeout(function() {
				$('.search-results-item').remove();
				container.removeClass('show');
				container.animate({
					width: '40px'
				}, 100, function() {
					$('.navigation').show();
	
					setTimeout(function() {
						container.removeClass('open');
						block.show();
					}, 400);
				});
			}, 150);

		}
	});

	// 
	$('.mobile-menu--button').on('click', function() {
		var dropdown = $('.mobile-navigation-container');

		if (dropdown.hasClass('show'))
			closeDropdown(dropdown);
		else 
			dropdown.addClass('show');
	});

	$(document).mouseup(function (e) {
		var container = $('.mobile-nav');
		var dropdown = $('.mobile-navigation-container');

		if (container.has(e.target).length === 0 && dropdown.hasClass('show')){
			closeDropdown(dropdown);
		}
	});

	// 

});

function closeDropdown(block) {
	block.addClass('close');
	setTimeout(function() {
		block.removeClass('show');
		block.removeClass('close');
	}, 250);
}

function setResultsToSearch(data) {

	var block, container;

	if ($(document).width() > 1200) {
		block 		= $('.search-results-block.desktop');
		container 	= $('.search-results-container.desktop');
	} else {
		block 		= $('.search-results-block.mobile');
		container 	= $('.search-results-container.mobile');
	}

	$.each(data, function(index, value) {
		var template = '<a href='+ value.url +' class="search-results-item">'+ value.title +'</a>';
		block.append(template);
	});

	container.addClass('show');
}