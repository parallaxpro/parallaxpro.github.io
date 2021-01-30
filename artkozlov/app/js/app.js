$(document).ready(function() {

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

	})

});