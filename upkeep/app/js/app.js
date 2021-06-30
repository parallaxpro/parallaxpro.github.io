// const { each } = require("jquery");

$(document).ready(function() {

    phone_mask();
    $(".default-select").selectmenu();

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
					console.log(value);
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

});

$(document).ready(function() {
		ymaps.ready(init);
	
	var myMap;

	function init() {

		var coords = $('#coordinates').val();

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

			console.log(coords);

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

function setAddress(res) {
	var firstGeoObject = res.geoObjects.get(0),
	// address = firstGeoObject.getAddressLine();
	address = firstGeoObject.properties._data.name,
	coord = firstGeoObject.geometry.getCoordinates();
	$('#address').val(address);
	$('#coordinates').val(coord);
	console.log(coord);
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
    console.log(to_input);
    console.log(result);
    $('#options-result').val(to_input);

}

$(document).on('keyup', '.options-groups input', function() {
    updateOptionsResult();
});

$(document).on('keypress', '.option-item--sum-input', function(event) {
    return event.charCode >= 48 && event.charCode <= 57;
});