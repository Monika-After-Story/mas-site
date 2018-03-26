function initFitText() {
	var restHead = $('#dyna-sitebuild-site-top-rest-head');
	restHead.length == 0 && (restHead = $('.dyna-sitebuild-site-top-rest-head'))
	var fontSize = restHead.css('font-size');
	var minSize = parseFloat(fontSize)/2;
	minSize = minSize.toString();
	restHead.fitText(1.2, {
		maxFontSize : fontSize,
		minFontSize : 5,
		restrictedObj : $('#dyna-sitebuild-site-top-rest-background')
	});

	var obj = $('#dyna-sitebuild-site-head:not(.dyna-sitebuild-site-img-head) #dyna-sitebuild-site-head-edit a');
	if (obj != null && obj.length > 0) {
		var fontSize = obj.css('font-size');
		var minSize = parseFloat(fontSize)/2;
		minSize = minSize.toString();
		obj.fitText(1.2, {
			maxFontSize : fontSize,
			minFontSize : 5,
			restrictedObj : $('#dyna-sitebuild-site-head')
		});
	}
}

function clickMenu(target) {
	var menuopen = $('#dyna-sitebuild-site-navi2-btn');
	var menuclose = $('#dyna-sitebuild-site-navi2-close');
	if (menuopen && isJqueryObjectExists(menuopen)
			&& (menuopen.is(target) || menuopen.has(target).length > 0)) {

		$('#dyna-sitebuild-site-navi2')
				.css('height', $('body').height() + 'px')
		$('#dyna-sitebuild-site-navi2').animate({
			width : '100%'
		}, 200);

	} else if (menuclose && isJqueryObjectExists(menuclose)
			&& (menuclose.is(target) || menuclose.has(target).length > 0)) {
		$('#dyna-sitebuild-site-navi2').animate({
			width : '0px'
		}, 200);
	}
}

$(document).ready(function() {
	$(document).click(function(e) {
		clickMenu(e.target);
	});
	var css = $('head #dyna-sitebuild-custom-css');
	if(css != null && css.length !== 0){
		css.ready(function(){
			initFitText();
		})
	} else {
		initFitText();
	}
});