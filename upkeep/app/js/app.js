import $ from 'jquery';

$(document).ready(function() {
    $(document).mouseup(function (e) {
		var container = $('.dropdown-btn');
		var dropdown = $('.dropdown-list');

		if (container.has(e.target).length === 0 && dropdown.hasClass('show--block')) closeDropdown(dropdown);
	});
});

function showAlertError(text) {
    var id = getRandomInt(16);
    var template = '<div class="alert-block show--block" data-id="'+ id +'">\
                        <span class="alert-block--text">'+ text +'</span>\
                        <span class="alert-block--close"></span>\
                    </div>';

    $('#alerts').children('.alerts-container').append(template);

    setTimeout(function() {
        var block = $('.alert-block[data-id='+ id +']');
        closeAlert(block);
    }, 2000);
}

function closeAlert(block) {
    block.addClass('close--block');
	setTimeout(function() {
        block.remove();
	}, 250);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


$(document).on('click', '.alert-block--close', function(e) {
    e.preventDefault();

    var parent = $(this).parent('.alert-block');
    closeAlert(parent);
})

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

$(document).on('click', '.popup-item--close', function(e) {
    e.preventDefault();
    closePopups();
});

$(document).on('click', '.popup-overlay', function() {
    closePopups();
});

function closePopups() {
    var $popup = $('.popup-item');
    closeDropdown($popup);

    $('.popup-overlay').fadeOut();
    $('#popups').fadeOut();
}

$('body').keydown(function(e) {
    if (e.keyCode == 27) closePopups();
});

$(document).on('click', '.bussiness-add', function(e) {
    e.preventDefault();
    var popup_id = $(this).data('popup');
    
    $('#popups').show(); $('.popup-overlay').fadeIn();
    $('.popup-item[data-id='+ popup_id +']').addClass('show--block');
})