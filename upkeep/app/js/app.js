// const { each } = require("jquery");

$(document).ready(function() {

    phone_mask();
    $(".default-select").selectmenu();

    autosize($('textarea'));

    $(document).mouseup(function (e) {
		var container = $('.dropdown-btn');
		var dropdown = $('.dropdown-list');

		if (container.has(e.target).length === 0 && dropdown.hasClass('show--block')) closeDropdown(dropdown);
	});

    $('#set_password').on('submit', function(e) {
		e.preventDefault();

		var button = $(this).children('button');
			button.attr('disabled', true);
			button.addClass('loading');

		$.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            statusCode: {
                404: function() {
                    alert( "Страница не найдена." );
                }
            },
            success: function(result){
                buttonActive();
                closePopups();
            },
			error: function(result) {
				buttonActive();

				var errors = result.responseJSON.errors;

				$.each(errors, function(index, value) {
					$.each(value, function(error_index, error) {
						showAlertError(error);							
					});
					// console.log(value);
				})
			}
        });

		function buttonActive() {
			button.attr('disabled', false);
            button.removeClass('loading');
		}
	});

    $('input[data-spoiler]').on('change', function (e) {
        var id = $(this).data('spoiler');
        $('[data-spoiler_input='+ id +']').toggleClass('active');
    });

    // 

    $('#price').on('keyup', function() {
        // console.log($(this).val());

        var inputs = $('.option-item--sum-input');

        $.each(inputs, function(index, value) {

            var type_block = $('.option-item--sum-item[data-row='+ $(value).data('row') +'][data-options='+ $(value).data('options') +']');
            if (type_block.hasClass('plus')) var type = 'plus';
            else var type = 'minus';
            updateOptionRowSum(type, $(value).val(), $(value).data('row'), $(value).data('options'));

        });

    });

    $('input.mask-time').inputmask({
        "placeholder": "__:__ — __:__",
        'alias':'datetime', 'inputFormat':'HH:MM — HH:MM',
    });

});

$(document).on('click touchstart', '.input-animate', function() {
    
    $(this).parent().addClass("label-animate");
    
    $(this).blur(function() {
        
        if ($(this).val() == '') $(this).parent().removeClass("label-animate");
    
    });

})

$(function() {
    
    // $(".input-animate").on('click', function() {
    // });
    
    $.each($('input.input-animate'), function(index, value) {
        if ($(value).val() != '') updateInputsLabel($(this));
    });

    // $('input.input-animate').blur

});

function updateInputsLabel(input) {
    $(input).parent().addClass('label-animate');
}

$(document).ready(function() {
	ymaps.ready(init);
	
	var myMap;

	function init() {

		var coords = $('#coordinates').val();

		myMap = new ymaps.Map("map", {
			center: [43.635601,51.168254],
			controls: [],
			zoom: 11
		}, {
			balloonMaxWidth: 200,
			searchControlProvider: 'yandex#search'
		});

		ymaps.geolocation.get({
			provider: 'browser',
			mapStateAutoApply: true
		}).then(function(res) {

			// console.log(coords);

			if (!coords) {
				var coord = res.geoObjects.get(0).geometry.getCoordinates();			
			} else {
				var coord = coords.split(',');
			}

			myMap.setCenter(coord, 15);
			setAddress(res);
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
})

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
    if (e.keyCode == 27) {
        closePopups();

        $('.address-popup').toggleClass('active');
    }
});

$(document).on('click', '.bussiness-add', function(e) {
    e.preventDefault();
    var popup_id = $(this).data('popup');
    
    $('#popups').show(); $('.popup-overlay').fadeIn();
    $('.popup-item[data-id='+ popup_id +']').addClass('show--block');
});

$(document).on('click', '.popup-open', function(e) {
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

    last_input.children('.multiform-btns').children('.multiform-btn--plus').remove();

    var template = '\
    <div class="g-input" data-id="'+ next_id +'">\
        <label for="'+ multiform +'_'+ next_id +'" class="g-input--label">'+ label +'</label>\
        <input type="text" \
            name="'+ multiform +'['+ next_id +']" \
            id="'+ multiform +'_'+ next_id +'" \
            class="g-input--input input-animate" \
            data-mask="'+ mask +'" \
            data-multiform="'+ multiform +'"> \
        <div class="multiform-btns">\
            <span class="multiform-btn multiform-btn--minus" data-multiform="'+ multiform +'"></span>\
            <span class="multiform-btn multiform-btn--plus" data-multiform="'+ multiform +'"></span>\
        </div>\
    </div>';

    $container.append(template);

    if (multiform === 'phone' || multiform === 'whatsapp') phone_mask();

    if (last_input.data('id') === $container.children('.g-input').first().data('id')) {
        last_input.children('.multiform-btns').append('<span class="multiform-btn multiform-btn--minus" data-multiform="'+ multiform +'"></span>');
    }

}

$(document).on('click', '.multiform-btn--minus', function(e) {
    e.preventDefault();

    var multiform   = $(this).data('multiform');
    var id          = $(this).parent('.multiform-btns').parent('.g-input').data('id');

    var last_id     = $('.c-multiform[data-multiform='+ multiform +'] .g-input').last().data('id');

    multiformRemoveInput(multiform, id);

    if (last_id === id) {
        $('.c-multiform[data-multiform='+ multiform +'] .g-input').last().children('.multiform-btns').append('<span class="multiform-btn multiform-btn--plus" data-multiform="'+ multiform +'"></span>');
    }
        
    if ($('.c-multiform[data-multiform='+ multiform +'] .g-input').length === 1) {

        console.log($('.c-multiform[data-multiform='+ multiform +'] .g-input').last());

        $('.c-multiform[data-multiform='+ multiform +'] .g-input').last().children('.multiform-btns').children('.multiform-btn--minus').remove();

    }

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
            <div class="col-sm-3 mb-sm-0 mb-2">\
                <select id="'+ multiselect +'_'+ next_id +'" name="'+ multiselect +'['+ next_id +'][select]" class="default-select">\
                    <option value="vk">VK</option>\
                    <option value="instagram">Instagram</option>\
                    <option value="facebook">Facebook</option>\
                </select>\
            </div>\
            <div class="col-sm-9">\
                <div class="g-input">\
                    <label for="link_'+ next_id +'" class="g-input--label">Ссылка</label>\
                    <input type="text" name="'+ multiselect +'['+ next_id +'][value]" id="link_'+ next_id +'" class="g-input--input">\
                    <div class="multiform-btns" data-id="'+ next_id +'">\
                        <span class="multiselect-btn multiselect-btn--minus" data-multiselect="'+ multiselect +'" data-id="'+ next_id +'"></span>\
                        <span class="multiselect-btn multiselect-btn--plus" data-multiselect="'+ multiselect +'" data-id="'+ next_id +'"></span>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
    ';

    container.append(template);
    
    
    $('.multiselect-btn.multiselect-btn--plus[data-multiselect='+ multiselect +'][data-id='+ id +']').remove();
    
    // console.log(last_select);

    if (id === $('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').first().data('id')) {
        $('.multiform-btns[data-id='+ id +']').append('<span class="multiselect-btn multiselect-btn--minus" data-multiselect="'+ multiselect +'" data-id="'+ id +'"></span>');
    }
    
    $('.default-select').selectmenu();
});

$(document).on('click', '.multiselect-btn--minus', function(e) {
    e.preventDefault();

    var multiselect = $(this).data('multiselect');
    var container   = $('.c-multiselect[data-multiselect='+ multiselect +']');

    var id          = $(this).data('id');
    var last_id     = $('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').last().data('id');

    // if ($('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').last().data('id'))

    container.children('.multiselect-item[data-id='+ id +']').remove();

    if (id === last_id) {

        var current_id = $('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').last().data('id');

        $('.multiform-btns[data-id='+ current_id +']').append('<span class="multiselect-btn multiselect-btn--plus" data-multiselect="'+ multiselect +'" data-id="'+ current_id +'"></span>')

    }


    if ($('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').length === 1) {
        var first_id = $('.c-multiselect[data-multiselect='+ multiselect +'] .multiselect-item').first().data('id');
        $('.multiselect-btn--minus[data-id='+ first_id +']').remove();
    }
});

function setAddress(res) {
	var firstGeoObject = res.geoObjects.get(0),
	// address = firstGeoObject.getAddressLine();
	address = firstGeoObject.properties._data.name,
	coord = firstGeoObject.geometry.getCoordinates();
	$('#address').val(address);
	$('#coordinates').val(coord);
	// console.log(coord);
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


document.querySelectorAll('.drag-and-drop--input').forEach(inputElement => {
    const dropZoneElement = inputElement.closest('.drag-and-drop--block');

    dropZoneElement.addEventListener('click', e => {
        inputElement.click();
    });

    inputElement.addEventListener('change', e => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    })

    dropZoneElement.addEventListener('dragover', e => {
        e.preventDefault();
        dropZoneElement.classList.add('drag-and-drop--over');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZoneElement.addEventListener(type, e => {
            dropZoneElement.classList.remove('drag-and-drop--over');
        });
    });

    dropZoneElement.addEventListener('drop', e => {
        e.preventDefault();
        // console.log(e.dataTransfer.files);

        if(e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove('drag-and-drop--over');
    });
})

function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector('.drag-and-drop--thumb');

    // if(dropZoneElement.querySelector(''))
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drag-and-drop--image")) {
        dropZoneElement.querySelector(".drag-and-drop--image").remove();
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement('div');
        thumbnailElement.classList.add('drag-and-drop--thumb');
        dropZoneElement.prepend(thumbnailElement);
    }

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${ reader.result }')`;
        }
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}


$(document).on('input', '.g-input--input[maxlength]', function(e) {
    
    var input = $(this);
    var maxlength = Number(input.attr('maxlength'));
    var span = $('.g-input--maxlength[data-id='+ input.attr('id') +']')
    var span_value = Number(span.text());
    var value_length = input.val().length;

    var minus = maxlength - value_length;
    span.text(minus);
})

$(document).on('click', '.editor-menu--item', function() {

    var id = $(this).data('content');

    $('.editor-menu--item').removeClass('active');
    $(this).addClass('active');

    $('.editor-content').removeClass('active');
    $('.editor-content[data-content='+ id +']').addClass('active');

});

$(document).on('click', '.option-item--sum-item', function() {

    var input = $('.option-item--sum-input[data-row='+ $(this).data('row') +'][data-options='+ $(this).data('options') +']');

    if ($(this).hasClass('plus')) {
        $(this).removeClass('plus');
        $(this).addClass('minus');
        
        updateOptionRowSum('minus', input.val(), $(this).data('row'), $(this).data('options'));
    } else {
        $(this).addClass('plus');
        $(this).removeClass('minus');

        updateOptionRowSum('plus', input.val(), $(this).data('row'), $(this).data('options'));
    }

});

function updateOptionRowSum(type, sum, row_id, options_id) {

    var value = $('#price').val();
    var block = $('.option-item--sum-total[data-row='+ row_id +'][data-options='+ options_id +']');

    if (type === 'minus') block.text(value - sum);
    if (type === 'plus') block.text(Number(value) + Number(sum));

    // if (value === 0) block.text(value);
    
}

$(document).on('keyup', '.option-item--sum-input', function() {
    // console.log($(this).val());

    var type_btn = $('.option-item--sum-item[data-row='+ $(this).data('row') +'][data-options='+ $(this).data('options') +']');

    // var type = () => {
    //     if (type_btn.hasClass('plus')) return 'plus';
    //     else 'minus';
    // }

    if (type_btn.hasClass('plus')) var type = 'plus';
    else var type = 'minus';

    updateOptionRowSum(type, $(this).val(), $(this).data('row'), $(this).data('options'));
});

$(document).on('click', '.option-item--row-add', function(e) {
    e.preventDefault();

    var options_group   = $(this).data('options');
    var id              = $('.option-item--row[data-options='+ options_group +']').last().data('row') + 1;

    var template        = '\
    <div class="option-item--row" data-options="'+ options_group +'" data-row="'+ id +'">\
        <div class="option-item--title">\
            <input class="option-item--title-input" placeholder="Пункт" data-options="'+ options_group +'" data-row="'+ id +'">\
        </div>\
        <div class="option-item--sum">\
            <span class="option-item--sum-item plus" data-options="'+ options_group +'" data-row="'+ id +'"></span>\
            <input type="text" class="option-item--sum-input" placeholder="Сумма" data-options="'+ options_group +'" data-row="'+ id +'">\
            <span class="option-item--sum-total" data-options="'+ options_group +'" data-row="'+ id +'"></span>\
        </div>\
        <span class="option-item--row-delete-btn multiform-btn multiform-btn--minus"></span>\
    </div>\
    ';

    $('.option-item--rows[data-options='+ options_group +']').append(template);
    
});

$(document).on('click', '.option-item--row-delete-btn', function(e) {
    e.preventDefault();
    $(this).parent('.option-item--row').remove();
    updateOptionsResult();
});

$(document).on('click', '.option-group--delete-btn', function(e) {
    e.preventDefault();

    var id = $(this).data('options');
    $('.option-group--container[data-options='+ id +']').remove();

    updateOptionsResult();
    
});

$(document).on('click', '.option-add', function(e) {

    var next_id = $('.option-group--container').last().data('options') + 1;

    if (!next_id) var next_id = 1;

    var template = '\
    <div class="option-group--container" data-options="'+ next_id +'">\
        <div class="option-group--header">\
            <div class="option-group--title">\
                <input type="text" class="option-group--title-input" placeholder="Название опции" data-options="'+ next_id +'">\
            </div>\
            <div class="option-group--delete">\
                <span class="option-group--delete-btn multiform-btn multiform-btn--minus" data-options="'+ next_id +'"></span>\
            </div>\
        </div>\
        <div class="option-group--body">\
            <div class="option-item--rows" data-options="'+ next_id +'">\
                <div class="option-item--row" data-options="'+ next_id +'" data-row="1">\
                    <div class="option-item--title">\
                        <input class="option-item--title-input" placeholder="Пункт" data-options="'+ next_id +'" data-row="1">\
                    </div>\
                    <div class="option-item--sum">\
                        <span class="option-item--sum-item plus" data-options="'+ next_id +'" data-row="1"></span>\
                        <input type="text" class="option-item--sum-input" placeholder="Сумма" data-options="'+ next_id +'" data-row="1">\
                        <span class="option-item--sum-total" data-options="'+ next_id +'" data-row="1"></span>\
                    </div>\
                    <span class="option-item--row-delete-btn multiform-btn multiform-btn--minus"></span>\
                </div>\
            </div>\
            <span class="option-item--row-add" data-options="'+ next_id +'">Добавить пункт</span>\
        </div>\
    </div>\
    ';

    $('.options-groups').append(template);
});

function updateOptionsResult() {

    var blocks = $('.option-group--container');
    var result = [];

    $.each(blocks, function(index, block) {

        var id      = $(block).data('options');
        var rows    = $('.option-item--row[data-options='+ id +']');
        var $rows   = [];

        $.each(rows, function(row_index, row_value) {
            
            var row_id = $(row_value).data('row');

            if ($('.option-item--sum-item[data-row='+ row_id +'][data-options='+ id +']').hasClass('plus')) var type = 'plus';
            else var type = 'minus';

            $rows[row_id] = {
                'title': $('.option-item--title-input[data-row='+ row_id +'][data-options='+ id +']').val(),
                'type': type,
                'sum': $('.option-item--sum-input[data-row='+ row_id +'][data-options='+ id +']').val()
            }
            
        });

        result.push({
            'title': $('.option-group--title-input[data-options='+ id +']').val(),
            'rows': $rows
        });
    });

    
    var to_input = JSON.stringify(result);
    // console.log(to_input);
    // console.log(result);
    $('#options-result').val(to_input);

}

$(document).on('keyup', '.options-groups input', function() {
    updateOptionsResult();
});

$(document).on('keypress', '.option-item--sum-input', function(event) {
    return event.charCode >= 48 && event.charCode <= 57;
});

$(document).on('click', '.mobile-menu-btn', function(e) {
    e.preventDefault();
    
    $(this).toggleClass('opened');
    $('.mobile-menu').toggleClass('active');
    $('.overlay').fadeToggle();
    $('.mobile-header').toggleClass('fixed');
});

$(document).on('click', '.catalog-footer--item', function(e) {
    var id = $(this).data('id');

    $('.catalog-footer--item').removeClass('active');
    $(this).toggleClass('active');
    $('.data-spoiler').removeClass('active');


    $('.data-spoiler[data-id='+ id +']').addClass('active');
});


$(document).on('click', '.overlay', function(e) {

    handleClickOverlay();

})

function handleClickOverlay() {
    
    $('.overlay').fadeToggle();
    $('.mobile-menu').toggleClass('active');
    $('.mobile-header').toggleClass('fixed');
    $('.mobile-menu-btn').toggleClass('opened');

}

$(document).on('click', '.add-domain', function(e) {
    e.preventDefault();

    $('.url_slug').toggleClass('active');
    $('.url_domain').toggleClass('active');
});

$(document).on('click', '.remove-domain', function(e) {
    e.preventDefault();

    $('.url_slug').toggleClass('active');
    $('.url_domain').toggleClass('active');

    $('#domain').val('');
});

$(document).on('keydown', '.addresses-coord', function(e) {
    return false;
});

$(document).on('click', '.select-to-map', function(e) {
    e.preventDefault();

    var id = $(this).data('id');
    $('.address-popup').toggleClass('active');
    $('#map-button').data('id', id);
});

$(document).mouseup(function (e) {
    var container = $(".address-block");
    if (container.has(e.target).length === 0){
        $('.address-popup').removeClass('active');
    }
});

$(document).on('click', '#map-button', function(e) {
    e.preventDefault();

    var id = $(this).data('id');
    $('input[data-address='+ id +']').val($('#address').val());
    $('input[data-coordinates='+ id +']').val($('#coordinates').val());

    $('.address-popup').toggleClass('active');

    // console.log($(this).data('id'));
});

// $(document).on('click', '.add-address', function(e) {
//     e.preventDefault();
//     createAddressBlock();
// });

// function createAddressBlock() {
//     var last_id = $('.addresses-item').last().data('id'); if (last_id == null) last_id = 0;
//     var next_id = last_id + 1;

//     var template = '<div class="addresses-item" data-id="'+ next_id +'">\
//                         <div class="addresses-item--coordinates">\
//                             <div class="row">\
//                                 <div class="col-12 mb-3">\
//                                     <select class="default-select">\
//                                         <option value="0">Актау</option>\
//                                     </select>\
//                                 </div>\
//                                 <div class="col-sm-8">\
//                                     <div class="default-input input-container input-container-btn">\
//                                         <input type="text" class="input-dummy" placeholder="Адрес" name="address['+ next_id +'][address]" data-address="'+ next_id +'" data-id="'+ next_id +'" required>\
//                                         <span class="input-btn select-to-map" data-id="'+ next_id +'">Открыть карту</span>\
//                                     </div>\
//                                 </div>\
//                                 <div class="col-sm-4 mt-sm-0 mt-3">\
//                                     <input type="text" class="default-input addresses-coord" name="address['+ next_id +'][coordinates]" placeholder="Координаты" data-coordinates="'+ next_id +'" data-id="'+ next_id +'" required>\
//                                 </div>\
//                             </div>\
//                         </div>\
//                         <div class="addresses-item--work_schedule">\
//                             <div class="addresses-item--work_schedule--title">График работы</div>\
//                             <input type="text" class="default-input" name="address['+ next_id +'][work_schedule]" placeholder="Введите график">\
//                         </div>\
//                         <span class="delete-btn address-delete" data-id="'+ next_id +'">Удалить адрес</span>\
//                     </div>';

    
//     $('#addresses').append(template);
//     $(".default-select").selectmenu();    
// }


// $(document).on('click', '.warehouse-row--delete', function(e) {
//     e.preventDefault();
//     $('.warehouse-editor--row[data-id='+ $(this).data('id') +']').remove();
// });

// $(document).on('click', '.add-warehouse-item', function(e) {
//     e.preventDefault();
//     createWarehouseRow();
// });

// function createWarehouseRow() {

//     var last_id = $('.warehouse-editor--row').last().data('id'); if (last_id == null) last_id = 0;
//     var next_id = last_id + 1;
    
//     var template = '<div class="warehouse-editor--row" data-id="'+ next_id +'">\
//                         <div class="warehouse-row--title">\
//                             <input type="text" class="warehouse-row--title-input" placeholder="Найти товар">\
//                             <input type="hidden" class="warehouse-row--id">\
//                             <span class="warehouse-row--title-price">3000</span>\
//                             <div class="warehouse-row--products-dropdown">\
//                                 <div class="warehouse-row--products-dropdown-item">Тигровые креветки</div>\
//                             </div>\
//                         </div>\
//                         <div class="warehouse-row--quantity">\
//                             <span class="warehouse-row--quantity-toggle plus"></span>\
//                             <input type="text" class="warehouse-row--quantity-input" placeholder="Кол-во">\
//                             <span class="warehouse-row--quantity-total"></span>\
//                         </div>\
//                         <span class="multiform-btn multiform-btn--minus warehouse-row--delete" data-id="'+ next_id +'"></span>\
//                     </div>';

//     $('.warehouse-editor-list').append(template);

// }