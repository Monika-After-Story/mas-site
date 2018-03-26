/*global jQuery */
/*!
 * FitText.js 1.2
 *
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Thu May 05 14:23:00 2011 -0600
 */

(function($) {

	$.fn.fitText = function(kompressor, options) {

		// Setup options
		var compressor = kompressor || 1, settings = $.extend({
			'minFontSize' : Number.NEGATIVE_INFINITY,
			'maxFontSize' : Number.POSITIVE_INFINITY,
			'restrictedObj' : null,
			'activeTriggerObjId' : null,
			'activeTriggerClass' : null,
			'runWidth':	null
		}, options);

		return this
				.each(function() {

					// Store the object
					var $this = $(this);
					var $restricted = settings.restrictedObj;
					var $hasTrigger = (settings.activeTriggerObjId != null && settings.activeTriggerClass != null);
					// Resizer() resizes items based on the object width divided
					// by the
					// compressor * 10
					var resizer = function() {
						var canRun = false;
						if (!$hasTrigger) {
							canRun = true;
						} else {
							var triggerObj = $('#'
									+ settings.activeTriggerObjId);
							if (triggerObj
									.hasClass(settings.activeTriggerClass)) {
								canRun = true;
							}else{
								if(settings.runWidth != null && $(window).width() < settings.runWidth){
									canRun = true;
								}
							}
						}
						if (canRun) {
							var restrictedWidth = $this.width();
							if ($restricted != null) {
								restrictedWidth = $restricted.width();
							}

							var windowWidth = $(window).width();
							var size = Math.max(Math.min(Math.min(
									restrictedWidth / (compressor * 10),
									parseFloat(settings.maxFontSize)),
									(windowWidth / (compressor * 10))),
									parseFloat(settings.minFontSize));
							$this.css('font-size', size);
							while ((($this.width() > $restricted.width()) || ($(
									window).width() < $this.width()))
									&& size > parseFloat(settings.minFontSize)) {
								size = size - 0.5;
								$this.css('font-size', size);
							}
						}
					};

					// Call once to set.
					resizer();

					// Call on resize. Opera debounces their resize by default.
					$(window).on('resize.fittext orientationchange.fittext',
							resizer);

				});

	};

})(jQuery);