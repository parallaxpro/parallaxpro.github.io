$(function() {
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

    // var swiper = new Swiper('.swiper-container', {
    //     // Optional parameters
    //     direction: 'horizontal',      
    //     // Navigation arrows
    //     navigation: {
    //       nextEl: '.swiper-button-next',
    //       prevEl: '.swiper-button-prev',
    //     },
    // });
    
});

function closeDropdown(block) {
	block.addClass('close');
	setTimeout(function() {
		block.removeClass('show');
		block.removeClass('close');
	}, 250);
}

$(document).on('click', '#quiz-next', function(e) {
    e.preventDefault();

    var current_key = $('.quiz-question.active').data('key');
    var next_key = current_key + 1;

    var last_key = $('.quiz-question').last().data('key');
    $('#quiz-prev').fadeIn(100);

    if (last_key === next_key) $(this).fadeOut(100, function() {
        $('#quiz-complete').fadeIn(100);
    });

    showQuestion(next_key);
});

$(document).on('click', '#quiz-prev', function(e) {
    e.preventDefault();

    var current_key = $('.quiz-question.active').data('key');

    var next_key = current_key - 1;

    var last_key = $('.quiz-question').last().data('key');
    var first_key = $('.quiz-question').first().data('key');

    if (first_key === next_key) $(this).fadeOut(100);
    if (next_key !== last_key) $('#quiz-complete').fadeOut(100, function() {
        $('#quiz-next').fadeIn(100);
    })

    showQuestion(next_key);
});

function showQuestion(key) {
    $('.quiz-question').removeClass('active');
    $('.quiz-question[data-key='+ key +']').addClass('active');
}