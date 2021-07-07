import autosize from 'autosize';

$(function () {

	autosize($('textarea'));
	$('select').selectmenu();

	const swiper = new Swiper('.main-slider--slider', {
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
		var input = $('input[data-cart_input='+ $(this).data('cart_input') +']');
		var value = Number(input.val()) + 1;

		var input_close = $('.product-card--cart-qty--minus[data-cart_input='+ $(this).data('cart_input') +']');
		var input_minus = $('.cart-item--qty--minus[data-cart_input='+ $(this).data('cart_input') +']');

		if (value > 1) input_close.addClass('close');
		if (value > 1) input_minus.addClass('minus');
		
		input.val(value);
	});

	$('[data-cart_minus]').on('click', function() {
		var input = $('input[data-cart_input='+ $(this).data('cart_input') +']');
		var value = Number(input.val());
		var next_value = value - 1;
		if (next_value === 1) {$(this).removeClass('close'); $(this).removeClass('minus');}
		
		if (value > 1) input.val(next_value);
		else closeCartBtn($(this).data('cart_input'));
	});

	$(document).on('click', '.catalog-section--button', function(e) {
		e.preventDefault();

		var block = $('.catalog-section--content[data-id='+ $(this).data('id') +']');
		var btn = $(this).children('.spoiler-btn');

		if (block.hasClass('active')) {
			block.slideUp();
			block.removeClass('active');
			btn.removeClass('active');
			btn.text('Развернуть');
		} else {
			block.slideDown();
			block.addClass('active');
			btn.addClass('active');
			btn.text('Свернуть');
		}

	});

	$(document).on('click', '.product-card--cart-btn', function(e) {
		e.preventDefault();

		var id = $(this).data('id');
		var container = $('.product-card--cart-qty[data-id='+ id +']');

		$(this).fadeOut(100, function() {
			container.fadeIn(100).css('display', 'flex');
		})
	});

	// Main Menu
	const slider = document.querySelector('.menu-catalog');
	let mouseDown = false;
	let startX, scrollLeft;

	let startDragging = function (e) {
		mouseDown = true;
		startX = e.pageX - slider.offsetLeft;
		scrollLeft = slider.scrollLeft;
	};
	let stopDragging = function (event) {
		mouseDown = false;
	};

	slider.addEventListener('mousemove', (e) => {
		e.preventDefault();
		if(!mouseDown) { return; }
		const x = e.pageX - slider.offsetLeft;
		const scroll = x - startX;
		slider.scrollLeft = scrollLeft - scroll;
	});

	// Add the event listeners
	slider.addEventListener('mousedown', startDragging, false);
	slider.addEventListener('mouseup', stopDragging, false);
	slider.addEventListener('mouseleave', stopDragging, false);
	// 

	$('a[href^="#"]').on('click', function(event) {
		// отменяем стандартное действие
		if ($(this).attr('href') === $(this).data('url')) {
			return true;
		}

		event.preventDefault();

		
		var sc = $(this).attr("href"),
			dn = $(sc).offset().top - 100;
		/*
		* sc - в переменную заносим информацию о том, к какому блоку надо перейти
		* dn - определяем положение блока на странице
		*/
		
		$('html, body').animate({scrollTop: dn}, 500);
	});


	$('input[name=delivery]').on('click', function(e) {
		// e.preventDefault();

		var id = $(this).data('id');
		$('.delivery-step').hide();
		$('.delivery-step[data-id='+ id +']').show();

		var text = $('label[for='+ $(this).attr('id') +']').text();
		$('#total-devilery').text(text);
	});


	setActiveListElements(); updateMenuPadding();
});

function closeCartBtn(id) {
	$('.product-card--cart-qty[data-id='+ id +']').fadeOut(100, function() {
		$('.product-card--cart-btn[data-id='+ id +']').fadeIn(100).css('display', 'flex');
		// $('input.product-card--cart-qty--input[data-cart_input='+ id +']').attr('data')
	});
};

function setActiveListElements(event){
	var windowPos = $(window).scrollTop() + 100;

	$('#menu-catalog a[href^="#"]').each(function() { 

		var currentLink = $(this);

		if ($(currentLink.attr("href")).length > 0) {
			var refElement = $(currentLink.attr("href"));
			if (refElement.position().top <= windowPos && (refElement.position().top + refElement.height() + $("#menu-catalog").height()) > windowPos) {
				$('#menu-catalog a').removeClass("active");
				currentLink.addClass("active");
			}
			else{
				currentLink.removeClass("active");
			}
		}

	});
}

$(window).scroll(function() {
	setActiveListElements();
});

$(window).resize(function() {
	updateMenuPadding();
});

$(document).on('click', '.product-page--desc-title', function() {

	var id = $(this).data('id');

	$('.product-page--desc-text').removeClass('active');
	$('.product-page--desc-title').removeClass('active');
	
	$(this).addClass('active');
	$('.product-page--desc-text[data-id='+ id +']').addClass('active');


});

function updateMenuPadding() {
	var footer_left = document.getElementById("footer").getBoundingClientRect().left;
	$('.menu-catalog').css('paddingLeft', footer_left);
}