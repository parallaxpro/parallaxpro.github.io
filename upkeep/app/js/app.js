$(document).ready(function() {

    phone_mask();
    $(".default-select").selectmenu();

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
    $('.c-multiform[data-multiform='+ multiform +']').children('.g-input[data-id='+ id +']').remove();
}

function phone_mask() {
    $('input[data-mask="phone"]').inputmask("mask", {"mask": "(999) 999-99-99"});
}

$(document).on('click', '.multiselect-btn--plus', function(e) {
    e.preventDefault();

    var multiselect = $(this).data('multiselect');
    var container   = $('.c-multiselect[data-multiselect='+ multiselect +']');
    var last_select = container.children('.multiselect-item').last();
    var id          = last_select.data('id');
    var next_id     = id + 1;


    var template    = '\
    <div class="multiselect-item" data-id="'+ next_id +'">\
        <div class="row">\
            <div class="col-3">\
                <select id="'+ multiselect +'_'+ next_id +'" name="'+ multiselect +'['+ next_id +'][select]" class="default-select">\
                    <option value="vk">VK</option>\
                    <option value="instagram">Instagram</option>\
                    <option value="facebook">Facebook</option>\
                </select>\
            </div>\
            <div class="col-9">\
                <div class="g-input">\
                    <label for="link_'+ next_id +'" class="g-input--label">Ссылка</label>\
                    <input type="text" name="'+ multiselect +'['+ next_id +'][value]" id="link_'+ next_id +'" class="g-input--input">\
                    <span class="multiselect-btn multiselect-btn--plus" data-multiselect="'+ multiselect +'" data-id="'+ next_id +'"></span>\
                </div>\
            </div>\
        </div>\
    </div>\
    ';

    container.append(template);
    $('.multiselect-btn[data-multiselect='+ multiselect +'][data-id='+ id +']').removeClass('multiselect-btn--plus').addClass('multiselect-btn--minus');

    $('.default-select').selectmenu();
});

$(document).on('click', '.multiselect-btn--minus', function(e) {
    e.preventDefault();

    var multiselect = $(this).data('multiselect');
    var container   = $('.c-multiselect[data-multiselect='+ multiselect +']');
    var id          = $(this).data('id');

    container.children('.multiselect-item[data-id='+ id +']').remove();
});

$(document).ready(function() {

	ymaps.ready(init);
	
	var myMap;
	function init() {
		myMap = new ymaps.Map("map", {
			center: [55.76, 37.64],
			controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
			zoom: 11
		}, {
			balloonMaxWidth: 200,
			searchControlProvider: 'yandex#search'
		});

		ymaps.geolocation.get({
			provider: 'browser',
			mapStateAutoApply: true
		}).then(function(res) {
			console.log(res);
			var coord = res.geoObjects.get(0).geometry.getCoordinates();
			myMap.setCenter(coord, 15);

			setAddress(res);
			// ymapsContent(myMap, res);
		});

		myMap.events.add('actionbegin', function(e) {
			// console.log('начинаем');
			$('#marker').addClass('active');
		})

		myMap.events.add('actionend', function(e) {
			$('#marker').removeClass('active');

			ymaps.geocode(myMap.getCenter(), {
				/**
				 * Опции запроса
				 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
				 */
				// Ищем только дома.
				kind: 'house',
				// Запрашиваем не более 1 результата.
				results: 1
			}).then(function(res) {
				setAddress(res);
			});
		});
	}
    
    // $(".image-base").change(function(){
    //     readURL(this);
    // });

});

function setAddress(res) {
	var firstGeoObject = res.geoObjects.get(0),
	address = firstGeoObject.getAddressLine();
	console.log(address);
}

// function readURL(input) {
// 	if (input.files && input.files[0]) {

// 		var reader 		= new FileReader();
// 		var $parent 	= $(input).data('parent');

// 		reader.onload = function (e) {
// 			$('label[for='+ $parent +']').css('background', 'url('+ e.target.result +')');
// 			// $('#blah').attr('src', e.target.result);
// 		}

// 		reader.readAsDataURL(input.files[0]);
// 	}
// }