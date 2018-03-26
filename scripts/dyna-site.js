(function($) {
	"use strict";
	$.fn.isJqueryObjectExists = function() {
		if (this == null || this.length == 0) {
			return false;
		}
		return true;
	};
})(jQuery);

$(document)
		.ready(
				function() {
					$(document).click(function(e) {
						messageButtonClick(e.target);
						thumbnailClick(e.target);
						postShareClick(e.target);
					});

					var navi = $('#dyna-sitebuild-site-navi #dyna-sitebuild-site-navi-list li a');
					$.each(navi, function() {
						if ($(this).attr('href') == window.location.pathname) {
							$(this).addClass('active')
						}
					});
					initEditBlocks();
					initVideo();
					initMenu();
					DynaGallery.reInit();
					DynaImage.reInit();
					initMaps();
				});

function initVideo() {
	// $.each($('.dyna-sitebuild-block-video .video-wrap'), function() {
	// 	insertThumbnailOrIframe($(this));
	// });
}

function initMenu() {
	$.each($('#dyna-sitebuild-site-navi-list li.drop'), function() {
		var ul = $(this).find('ul');
		if (ul && isJqueryObjectExists(ul)) {
			ul.css('min-width', $(this).width() + 'px');
		}
	});
}

function initEditBlocks() {
	var pv = GetURLParameter('preview');
	var hashmap = {};
	$.each($('#dyna-sitebuild-site-navi-list a'), function() {
		hashmap[$(this).text()] = $(this).attr('href');

	});
	$.each($('.dyna-sitebuild-block-edit .dyna-sitebuild-block-content a'),
			function() {
				var href = $(this).data('cke-saved-href');
				var onclick = $(this).data('cke-pa-onclick');
				if (href && isJqueryObjectExists(href)) {
					if (pv && isJqueryObjectExists(pv) && href.match(/^\//)) {
						var new_url = addParameterToUrl(href, 'preview', '1');
						$(this).attr('href', new_url);
					} else {
						var newHref = hashmap[href];
						if (newHref && (!$.isEmptyObject(newHref))) {
							$(this).attr('href', newHref);
						} 
					}

				}
				if (onclick && isJqueryObjectExists(onclick)) {
					$(this).attr('onclick', onclick);
				}

			});
}

function isJqueryObjectExists(obj) {
	if (obj == null || obj.length == 0) {
		return false;
	}
	return true;
}

function messageButtonClick(target) {
	var buttons = $('.dyna-sitebuild-message-button');
	$.each(buttons, function() {
		if ($(this).is(target)) {
			var contact_div = $(this).parents('.dyna-sitebuild-block-contact');
			if(contact_div != null && contact_div.length > 0){
				var form = $(this).parents('.dyna-sitebuild-contact-form');
				if(contact_div.hasClass('dyna-sitebuild-block-contact2')){
					handle_form_v2(form);
				}else{
					handle_form(form);
				}

			}


		}
	});
}

function handle_form(form) {
	form.validate({
		onkeyup : false,
		highlight : function(element) {
			$(element).css("border", "solid 1px #ff0000");
		},
		unhighlight : function(element) {
			$(element).css("border", "");
		},
		rules : {
			fn : {
				required : true
			},
			ln : {
				required : true
			},
			email : {
				required : true,
				email : true
			},
			message : {
				required : true
			}
		}
	});
	if (form.valid()) {
		uploadContactFormData(form, 1);
	}
}

function handle_form_v2(form){
	form.validate({
		onkeyup : false,
		highlight : function(element) {
			$(element).css("border", "solid 1px #ff0000");
		},
		unhighlight : function(element) {
			$(element).css("border", "");
		},
		rules : {
			name : {
				required : true
			},
			email : {
				required : true,
				email : true
			},
			message : {
				required : true
			}
		}
	});
	if (form.valid()) {
		uploadContactFormData(form, 2);
	}
}

function uploadContactFormData(form, version){
	var data = {};
	$.each(form.serializeArray(), function() {
		data[this.name] = this.value
	});
	var preview = GetURLParameter('preview');
	data.version = version;
	var url = '/dyna-builder/contact-handler.html'
	if(preview === undefined){

	}else{
		url = url +'?preview=1';
	}
	$.ajax({
			url : url,
			type : 'post',
			data : data,
			success : function(responseData) {
				if (responseData != null) {
					var json = null;
					try {
						json = $.parseJSON(responseData);
					}catch (e){
						json = null;
					}
					if(json != null){
						if(json.code === '0'){
							form
								.parents(
									'.dyna-sitebuild-block-content')
								.html(
									'<p>'+json.confirmation+'</p>');
						}
					}
				}

			}
	});
}

/*function insertThumbnailOrIframe(wrap) {
	var data_html = wrap.data('html');
	if (!data_html || !isJqueryObjectExists(data_html)) {
		return;
	}
	var thumbnail = wrap.data('thumbnail');
	if (thumbnail && isJqueryObjectExists(thumbnail)) {
		insertThumbnail(wrap);
	} else {
		insertIframe(wrap, false);
	}
}*/

function thumbnailClick(target) {
	var thumbnails = $('.dyna-sitebuild-block-video .dyna-video-thumbnail');
	$.each(thumbnails, function() {
		if ($(this).is(target) || $(this).has(target).length > 0) {
			var wrap = $(this).parents('.video-wrap');
			if (wrap && isJqueryObjectExists(wrap)) {
				insertIframe(wrap, true);
			}
			return false;
		}
	});
}

function postShareClick(target) {
	var items = $('.blog-post-share-text');
	$.each(items, function() {
		var shareWrap = $(this).parent();
		if ($(this).is(target) || $(this).has(target).lengh > 0) {
			if (shareWrap.hasClass('hidden')) {
				shareWrap.removeClass("hidden");
			}
		} else {
			if (!shareWrap.hasClass("hidden")) {
				shareWrap.addClass('hidden');
			}
		}
	});
}

/*function insertThumbnail(wrap) {
	var thumbnail = wrap.data('thumbnail');
	var thumbnailDiv = wrap.find('.dyna-video-thumbnail').first();
	if (!thumbnailDiv || isJqueryObjectExists(thumbnailDiv)) {
		thumbnailDiv = $('<div/>');
		thumbnailDiv.addClass('dyna-video-thumbnail');
		var img = $('<img/>');
		img.attr('src', thumbnail);
		thumbnailDiv.append(img);
		var play_icon = $('<div/>');
		play_icon.addClass('dyna-vidoe-play');
		thumbnailDiv.append(play_icon);
		wrap.html('');
		wrap.append(thumbnailDiv);
	} else {
		var img = thumbnailDiv.find('img').first();
		var play_icon = thumbnailDiv.find('.dyna-vidoe-play').first();
		if (!img || isJqueryObjectExists(img)) {
			img = $('<img/>');
			img.attr('src', thumbnail);
			if (!play_icon || !isJqueryObjectExists(play_icon)) {
				thumbnailDiv.append(img);
				var play_icon = $('<div/>');
				play_icon.addClass('dyna-vidoe-play');
				thumbnailDiv.append(play_icon);
			} else {
				play_icon.insertBefore(img);
			}

		} else {
			var src = img.attr('src');
			if (src != thumbnail) {
				img.attr('src', thumbnail);
			}
			if (!play_icon || isJqueryObjectExists(play_icon)) {
				var play_icon = $('<div/>');
				play_icon.addClass('dyna-vidoe-play');
				thumbnailDiv.append(play_icon);
			}
		}
	}
}*/

function insertIframe(wrap, autoplay) {
	var data_html = wrap.data('html');
	if (!autoplay) {
		var current_html = wrap.html();
		if (current_html != data_html) {
			wrap.html(data_html);
		}
	} else {
		var tmp = $('<div/>');
		tmp.html(data_html);
		var iframe = tmp.find('iframe').first();
		if (!iframe || !isJqueryObjectExists(iframe)) {
			return;
		}
		var src = iframe.attr('src');
		if (!src || !isJqueryObjectExists(src)) {
			return;
		}
		if (src.indexOf('?') == -1) {
			if (!rel || !isJqueryObjectExists(rel)) {
				src = src + '?rel=0&autoplay=1';
			}
		} else {
			var rel = getParameterByName(src, 'rel');
			var autoplay = getParameterByName(src, 'autoplay');
			if (!rel || !isJqueryObjectExists(rel)) {
				src = src + '&rel=0'
			}
			if (!autoplay || !isJqueryObjectExists(autoplay)) {
				src = src + '&autoplay=1'
			}
		}

		iframe.attr('src', src);
		wrap.html(tmp.html());

	}
}

function init_preview() {
	var pv = GetURLParameter('preview');
	if (pv && isJqueryObjectExists(pv)) {
		$.each($('.dyna-sitebuild-block-content a'), function() {
			var href = $(this).attr('href');
			if (href && isJqueryObjectExists(href) && href.match(/^\//)) {
				var new_url = addParameterToUrl(href, 'preview', '1');
				$(this).attr('href', new_url);
			}
		})
	}
}

function addParameterToUrl(url, param, value) {
	// check if param exists
	var result = new RegExp(param + "=([^&]*)", "i").exec(url);
	result = result && result[1] || "";
	// param doesn't exist in url, add it
	if (result == '') {
		// doesn't have any params
		if (url.indexOf('?') == -1) {
			url += "?" + param + '=' + value;
		} else {
			url += "&" + param + '=' + value;
		}
	}
	// return the finished url
	return url;
}

function GetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

function initMaps(){
	$.each($('.dyna-sitebuild-block-map iframe.dyna-sitebuild-map-frame'), function(){
		var src = $(this).attr('src');
		if(src.indexOf('/dyna-builder/google_map.html') == 0){
			src = '//sitebuilder.dynadot.com'+ src;
			$(this).attr('src', src);
		}
	});
}