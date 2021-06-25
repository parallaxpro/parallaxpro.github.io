$(function () {
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

	$('.product-qty--plus').on('click', function() {
		var input = $('input[data-cart_input='+ $(this).data('cart_input') +']');
		var value = Number(input.val()) + 1;
		input.val(value);
	});

	$('.product-qty--minus').on('click', function() {
		var input = $('input[data-cart_input='+ $(this).data('cart_input') +']');
		var value = Number(input.val());
		var next_value = value - 1; 
		if (value > 1) input.val(next_value);
	});
});