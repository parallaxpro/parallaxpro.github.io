import autosize from '../libs/autosize.min.js';

$(document).ready(function() {

	autosize($('textarea'));

	$('[data-fancybox]').fancybox({
		// clickContent: 'close',
		buttons: ['close', 'thumbs']
	})

	$(window).scroll(function(){
		$('.desktop-header, .mobile-header').toggleClass('scroll', $(this).scrollTop() > 0);
	});

	$('.menu-btn').on('click', function() {

		var menu = $('.mobile-menu');

		if (menu.hasClass('active')) {
			menu.removeClass('active');
			menu.slideUp();
		} else {
			menu.addClass('active');
			menu.slideDown();
		}

	});

	const swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		slidesPerColumn: 3,
		slidesPerColumnFill: 'row',
		spaceBetween: 20,
		// Navigation arrows
		navigation: {
		  nextEl: '.swiper-button-next',
		  prevEl: '.swiper-button-prev',
		},
	});

});

$(window).scroll(function(){
	$('.mobile-menu').slideUp();
});