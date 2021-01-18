import $ from 'jquery'; window.jQuery = $; window.$ = $ // import jQuery module (npm i -D jquery)
// require('~/app/libs/mmenu/js/jquery.mmenu.all.min.js') // import vendor jQuery plugin example (not module)

$(document).ready(function() {
	
	$(document).mouseup(function (e) {
		var container = $('.dropdown-btn');
		var dropdown = $('.dropdown-list');

		if (container.has(e.target).length === 0 && dropdown.hasClass('show--block')) closeDropdown(dropdown);
	});
	
});

$(document).on('click', '.dropdown-btn', function(e) {
	e.preventDefault();

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
