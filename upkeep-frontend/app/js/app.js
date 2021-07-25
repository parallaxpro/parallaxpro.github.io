$(function () {

	autosize($('textarea'));
	$('select').selectmenu();

	const swiper = new Swiper('.swiper-container', {
			// Optional parameters
			direction: 'horizontal',
			loop: true,
		
			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
			},
		
			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
	});

	$('[data-cart_input]').on('keypress', function(event) {
		return event.charCode >= 48 && event.charCode <= 57;
	});

	$('[data-cart_input]').blur(function() {
		if ($(this).val().length < 1 || $(this).val() == 0) $(this).val(1);
	});

	$('[data-cart_plus]').on('click', function() {
		
		var $id   = $(this).data('cart_plus');
		var input = $('input[data-cart_input='+ $id +']');
		var value = Number(input.val()) + 1;

		var input_minus = $('.handle-cart-btn--remove[data-cart_minus='+ $id +']');

		if (value > 1) input_minus.addClass('minus');
		
		input.val(value);
	});

	$('[data-cart_minus]').on('click', function() {

		var $id   = $(this).data('cart_minus');
		var input = $('input[data-cart_input='+ $id +']');
		var value = Number(input.val());
		var next_value = value - 1;

		if (next_value === 1) {$(this).removeClass('close'); $(this).removeClass('minus');}
		
		if (value > 1) input.val(next_value);
		else closeCartBtn($id);
	});

});

$(window).scroll(function(){
	// console.log(window.innerWidth);
	if (window.innerWidth < 992) {
		$('.cart-mobile--btn-container').toggleClass('active', $(this).scrollTop() > 50);
	}
});

function closeCartBtn(id) {

	var block 		= $('.catalog-product--add-cart[data-id='+ id +']');
	var count_block = $('.catalog-product--add-cart-count[data-id='+ block.data('id') +']');

	count_block.fadeOut(function() {
		block.fadeIn(200);
	});

};

$(document).on('click', '.catalog-product--add-cart', function(e) {
	e.preventDefault();

	$(this).addClass('added-cart');
	$(this).text($(this).data('added_text'));

	var block 		= $(this);
	var count_block = $('.catalog-product--add-cart-count[data-id='+ block.data('id') +']');

	setTimeout(function() {
		
		block.fadeOut(200, function() {
			count_block.css('display', 'flex');
			block.removeClass('added-cart');
			block.text(block.data('cart_text'));
		});

	}, 500);

});

$('input[name=delivery]').on('click', function(e) {
	// e.preventDefault();

	var id = $(this).data('id');
	$('.delivery-step').hide();
	$('.delivery-step[data-id='+ id +']').show();

	var text = $('label[for='+ $(this).attr('id') +']').text();
	$('#total-devilery').text(text);
});

var aside_menu_options = {
	menu: $('.aside-main'),
	content: $('.content-slided'),
	menu_width: $('.aside-main').outerWidth(true),
	menu_btn: $('.menu--btn'),
	footer_left: document.getElementById("footer").getBoundingClientRect().left
}

$(document).on('click', '.open-menu', function(e) {
	e.preventDefault();
	openMenu(aside_menu_options);
})

$(document).keyup(function(e) {
    if (e.keyCode === 27) { 
        closeMenu(aside_menu_options);
    }
});

$(document).on('click', '.menu--btn', function(e) {
	e.preventDefault();

	if ($(this).hasClass('opened')) closeMenu(aside_menu_options);
	else 							openMenu(aside_menu_options);
});

function openMenu(options) {

	// $('.menu-catalog').css('paddingLeft', footer_left);

	options.menu.css('left', options.footer_left);

	options.content.css({
		'-webkit-transform':'translateX('+ options.menu_width +'px)',
		'-ms-transform': 	'translateX('+ options.menu_width +'px)',
		'transform': 		'translateX('+ options.menu_width +'px)',
		'opacity': 			'0.25',
		'pointerEvents': 	'none',
	});

	if (window.innerWidth < 576) {
		options.content.css('display', 'none');
	}

	options.menu.css({
		'opacity': '1',
		'zIndex': '9999'
	});

	options.menu_btn.addClass('opened');
}

function closeMenu(options) {

	options.menu.css({
		'opacity': '0',
		'zIndex': '-9999'
	});

	options.content.css({
		'-webkit-transform':'translateX(0px)',
		'-ms-transform': 	'translateX(0px)',
		'transform': 		'translateX(0px)',
		'opacity': 			'1',
		'pointerEvents': 	'unset'
	});

	if (window.innerWidth < 576) {
		options.content.css('display', 'block');
	}

	options.menu_btn.removeClass('opened');
}

$(document).on('click', '.catalog-btn', function(e) {
	e.preventDefault();

	$(this).toggleClass('active');
	if ($(this).hasClass('active')) $(this).text($(this).data('hide_text'));
	else $(this).text($(this).data('show_text'));

	$('.mobile-nav').slideToggle();
})