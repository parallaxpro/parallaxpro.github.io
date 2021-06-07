$(document).ready(function() {

    phone_mask();

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
});

$(document).on('click', '.multiform-btn--plus', function(e) {
    e.preventDefault();

    var $multiform = $(this).data('multiform');
    multiformAddInput($multiform);
})

function multiformAddInput(multiform) {

    var $container  = $('.c-multiform[data-multiform='+ multiform +']');
    var last_input  = $container.children('.g-input').last();
    var next_id     = last_input.data('id') + 1;
    var label       = last_input.children('label').text();
    var mask        = last_input.children('input').data('mask');

    console.log(mask);

    last_input.children('.multiform-btn').removeClass('multiform-btn--plus').addClass('multiform-btn--minus');

    var template = '\
    <div class="g-input" data-id="'+ next_id +'">\
        <label for="'+ multiform +'_'+ next_id +'" class="g-input--label">'+ label +'</label>\
        <input type="text" \
            name="'+ multiform +'['+ next_id +']" \
            id="'+ multiform +'_'+ next_id +'" \
            class="g-input--input" \
            data-mask="'+ mask +'" \
            data-multiform="'+ multiform +'"> \
        <span class="multiform-btn multiform-btn--plus" data-multiform="'+ multiform +'"></span>\
    </div>';

    $container.append(template);

    if (multiform === 'phone' || multiform === 'whatsapp') phone_mask();
}

$(document).on('click', '.multiform-btn--minus', function(e) {
    e.preventDefault();

    var multiform   = $(this).data('multiform');
    var id          = $(this).parent('.g-input').data('id');

    multiformRemoveInput(multiform, id);
});

function multiformRemoveInput(multiform, id) {
    $('.c-multiform[data-multiform='+ multiform +']').children('.g-input[data-id='+ id +']').slideUp(300, function() { $(this).remove() });
}

function phone_mask() {
    $('input[data-mask="phone"]').inputmask("mask", {"mask": "(999) 999-99-99"});
}