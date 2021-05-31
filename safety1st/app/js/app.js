import $ from 'jquery'; window.jQuery = $; window.$ = $ // import jQuery module (npm i -D jquery)
require('~/app/libs/jquery-ui.js');
require('~/app/libs/jquery.fancybox.min.js');
// require('~/app/libs/mmenu/js/jquery.mmenu.all.min.js') // import vendor jQuery plugin example (not module)

$(document).ready(function() {

	document.addEventListener('contextmenu', event => event.preventDefault());
	
	$(document).mouseup(function (e) {
		var container = $('.dropdown-btn');
		var dropdown = $('.dropdown-list');

		if (container.has(e.target).length === 0 && dropdown.hasClass('show--block')) closeDropdown(dropdown);
	});

	$(document).mouseup(function (e) {
		var container = $('.user-add');

		if (container.has(e.target).length === 0) container.slideUp();
	});

	$('.btn-add--user').on('click', function(e) {
		e.preventDefault();

		if ($('.user-add.user-add--btn').is(':visible')) {
			$('.user-add.user-add--btn').slideUp();
		} else {
			$('.user-add.user-add--btn').slideDown();
		}
	});

	// var mySwiper = new Swiper('.swiper-container', {
	// 	// Navigation arrows
	// 	navigation: {
	// 		nextEl: '.swiper-button-next',
	// 		prevEl: '.swiper-button-prev',
	// 	},
	// });
	
});

$(function() {
    $("#progressbar").progressbar({
		value: $('#quiz-bar').data('value')
	});
});

$(document).on('click', '.dropdown-btn', function(e) {
	// e.preventDefault();

	var dropdown = $(this).children('.dropdown-list');
	
	if (dropdown.hasClass('show--block')) closeDropdown(dropdown);
	else dropdown.addClass('show--block');
})

function closeDropdown(block) {
	block.addClass('close--block');
	setTimeout(function() {
		block.removeClass('show--block');
		block.removeClass('close--block');
	}, 250);
}

$(document).on('click', '.c-row-users .c-row', function(e) {
	e.preventDefault();

	var id = $(this).data('id');
	var user_block = $('.user-add[data-id='+ id +']');

	if (user_block.hasClass('active')) {
		user_block.slideUp();
		user_block.removeClass('active');
	} else {
		user_block.slideDown();
		user_block.addClass('active');
	}


	// if (!$(this).hasClass('active')) {
	// 	$(this).children('.user-add').slideDown();
	// 	$(this).addClass('active');
	// } else {
	// 	$(this).children('.user-add').slideUp();
	// 	$(this).removeClass('active');
	// }
})

$(document).on('change', '#is_agreement', function() {
	
	var btn = $('[data-btn=is_agreement]');

	btn.toggleClass('btn-confirm');

	if (btn.is('[disabled]')) btn.attr('disabled', false);
	else btn.prop('disabled', true);
	
	// btn-confirm
});