var DynaGallery = (function($, undefined) {
    var isJqueryObjectExists = function(obj) {
        if (obj == null || obj.length == 0) {
            return false;
        }
        return true;
    }
    var styleClasses = ['slide', 'carousel', 'grid', 'stacked'];
    var clickRowConfig = {
        'transition-row': 'transition-speed-row',
        'show-thumbnail-row': 'thumbnail-height-row,thumbnail-top-row'
    };

    var screenshotMap = {
        "BriarYoung": "Briar Young",
        "ManuEcheveste": "ManuEcheveste",
        "mas-hangman": "MAS Team",
        "mas-piano": "MAS Team",
        "moonstne": "moonstne",
        "multi": "multi",
        "NoexHaruhi": "NoexHaruhi",
        "NoexHaruhi-2": "NoexHaruhi",
        "Rai99": "Rai99",
        "Rai99-2": "Rai99",
        "Trilasent": "Trilasent"
    };

    var divGItem = '<div class="dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image"></div>';
    var divAuthOverlay = '<div class="_authorOverlay"></div>';
    var divGItemDR = '"0.5666666666666667"';
    var divGItemDMR = '"0.5555555555555556"';
    var imgPath = "/img/";
    var imgExt = "png";

    var aspectRatios = [{
        name: "1:1 Square",
        ratio: 100
    }, {
        name: '3:2 Standard',
        ratio: 66.66
    }, {
        name: '2:3 Standard(Vertical)',
        ratio: 150
    }, {
        name: '4:3 Four-Three',
        ratio: 75
    }, {
        name: '3:4 Three-Four(Vertical)',
        ratio: 133.33
    }, {
        name: '16:9 Widescreen',
        ratio: 56.25
    }, {
        name: '2.40 Anamorphic Widescreen',
        ratio: 41.66
    }];

    var slidersConfig = {
        'transition-speed-row': {
            min: 1,
            max: 10,
            step: 1
        },
        'thumbnail-height-row': {
            min: 0,
            max: 200,
            step: 1
        },
        'thumbnail-top-row': {
            min: 0,
            max: 60,
            step: 1
        },
        'grid-thumbnail-num-row': {
            min: 1,
            max: 10,
            step: 1
        },
        'grid-thumbnail-padding-row': {
            min: 0,
            max: 50,
            step: 1
        }
    };

    var defaultOptions = [{
        $AutoPlay: false,
        $AutoPlayInterval: 5000,
        $PauseOnHover: 3,
        $MinDragOffsetToSlide: 20,
        $ArrowNavigatorOptions: {
            $ChanceToShow: 0,
            $AutoCenter: 2,
            $Steps: 1
        },
        $ThumbnailNavigatorOptions: {
            $ChanceToShow: 0,
            $SpacingX: 0,
            $Height: 80,
            $Top: 20
        }
    }, {
        $AutoPlay: false,
        $AutoPlayInterval: 5000,
        $ArrowNavigatorOptions: {
            $ChanceToShow: 0,
            $AutoCenter: 2,
            $Steps: 1
        }
    }, {
        $AspectRatio: 0,
        $ImagePerRow: 4,
        $Padding: 20,
        $Lightbox: false
    }];

    var shuffle = function (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    var reInitClass = function(block, type) {
        for (var i = 0; i < styleClasses.length; i++) {
            var className = 'dyna-sitebuild-gallery-' + styleClasses[i];
            if (i == type) {
                if (!block.hasClass(className)) {
                    block.addClass(className);
                }
            } else {
                if (block.hasClass(className)) {
                    block.removeClass(className);
                }
            }
        }
    };

    var reInitialGallery = function(block) {
        var type = block.data('type');
        if (!isJqueryObjectExists(type)) {
            return;
        }
        type = parseInt(type);
        switch (type) {
            case 0:
                reInitSlide(block);
                reInitClass(block, 0);
                break;
            case 1:
                reInitCarousel(block);
                reInitClass(block, 1);
                break;
            case 2:
                reInitGrid(block);
                reInitClass(block, 2);
                break;
            case 3:
                reInitStack(block);
                reInitClass(block, 3);
                break;
            default:
                break;
        }
    };

    var reInitSlide = function(block) {
        var html = block.data('html');
        var options = block.data('options');
        var ratio = block.data('ratio');
        var slideOptions = jQuery.extend(true, {}, options);
        // var slideOptions = options;
        if (isJqueryObjectExists(slideOptions['$ThumbnailNavigatorOptions']['$Height'])) {
            delete slideOptions['$ThumbnailNavigatorOptions']['$Height'];
        }
        if (isJqueryObjectExists(slideOptions['$ThumbnailNavigatorOptions']['$Top'])) {
            delete slideOptions['$ThumbnailNavigatorOptions']['$Top'];
        }

        slideOptions['$ArrowNavigatorOptions']['$Class'] = $JssorArrowNavigator$;
        slideOptions['$ThumbnailNavigatorOptions']['$Class'] = $JssorThumbnailNavigator$;
        var tmp = $('<div></div>');
        tmp.html(html);
        var width = block.width();
        var height = width * ratio;
        var w = width;
        w <= 100 ? w = 100 : w <= 300 ? w = 300 : w <= 500 ? w = 500 : w <= 750 ? w = 750 : w <= 1000 ? w = 1000 : w <= 1500 ? w = 1500 : w <= 2500 && (w = 2500)
        var slideContainer = $('<div class="dyna-sitebuild-gallery-slide-container"></div>');
        slideContainer.uniqueId();
// slideContainer.attr('id',
// 'dyna-sitebuild-gallery-slide-container-' + block.uniqueId());
        var slidesWrap = $('<div class="dyna-sitebuild-gallery-slides-wrap"></div>');

        var thumbnailHeight = 0;
        if (slideOptions['$ThumbnailNavigatorOptions']['$ChanceToShow'] != '0') {
            thumbnailHeight = parseInt(options['$ThumbnailNavigatorOptions']['$Height']);
        }
        var thumbnailTop = 0;
        if (slideOptions['$ThumbnailNavigatorOptions']['$ChanceToShow'] != '0') {
            thumbnailTop = parseInt(options['$ThumbnailNavigatorOptions']['$Top']);
        }
        slideContainer.css('height', (height + thumbnailHeight + thumbnailTop) + 'px');
        slidesWrap.css('height', height + 'px');
        var newBlockItems = $('<div class="dyna-sitebuild-gallery-items"></div>');
        var imgs = tmp.find('.dyna-sitebuild-gallery-item');
        newBlockItems.attr('u', 'slides');

        var ssKeys = shuffle(Object.keys(screenshotMap));

        for (const ssKey of ssKeys)
        {
            // construct the div to contain each image slider
            var item = $(divGItem);

            // construct the image
            var image = $('<img>');
            image.attr("src", imgPath + ssKey + "." + imgExt);
            image.attr('u', 'image');

            // add image to container div
            item.append(image)

            // construct the overlay div
            var overlayDiv = $(divAuthOverlay);
            overlayDiv.text("Screenshot taken by: " + screenshotMap[ssKey]);
            item.append(overlayDiv)

            newBlockItems.append(item);
        }

        /*
        $.each(imgs, function() {
            if ($(this).hasClass('dyna-sitebuild-gallery-image'))
            {
                var img = $(this).find('img');
                if (isJqueryObjectExists(img))
                {
                    var src = img.attr('src');
                    if (isJqueryObjectExists(src)) 
                    {
                        var item = $(divGItem);
                        var image = $('<img/>');
                        if (src.indexOf('?img_id') != -1) 
                        {
                            var newSrc = src + '&w=' + w;
                            image.attr('src', newSrc);
                        }
                        else
                        {
                            image.attr('src', src);
                        }
                        var r = img.data('ratio');
                        var h = width * r;
                        if(r != ratio){
                            image.css('margin-top', (height-h)/(2*width)*100+'%');
                        }
                        item.append(image);
                        image.attr('u','image');

                        if (slideOptions['$ThumbnailNavigatorOptions']['$ChanceToShow'] != '0')
                        {
                            var thumbnail = $('<img/>');
                            thumbnail.attr('src', src);
                            thumbnail.attr('u','thumb');
                            item.append(thumbnail);
                        }
                        newBlockItems.append(item);
                    }
                }
            }
        });
        */

        /*
         *
    data-html="&lt;div class=&quot;dyna-sitebuild-gallery-items&quot;&gt;&lt;div class=&quot;dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image&quot;&gt;&lt;img src=&quot;/dyna-builder/user_images/MAS-1.png?img_id=23&amp;amp;sbid=39580&quot; data-ratio=&quot;0.5666666666666667&quot;&gt;&lt;/div&gt;&lt;div class=&quot;dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image&quot;&gt;&lt;img src=&quot;/dyna-builder/user_images/MAS-4.png&quot;&quotdata-ratio=&quot;0.5666666666666667&quot;&gt;&lt;/div&gt;&lt;div class=&quot;dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image&quot;&gt;&lt;img src=&quot;/dyna-builder/user_images/MAS-5.png&quot;&quotdata-ratio=&quot;0.5666666666666667&quot;&gt;&lt;/div&gt;&lt;div class=&quot;dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image&quot;&gt;&lt;img src=&quot;/dyna-builder/user_images/hangman2.jpg&quot;&quot;data-ratio=&quot;0.5555555555555556&quot;&gt;&lt;/div&gt;&lt;div class=&quot;dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image&quot;&gt;&lt;img src=&quot;/dyna-builder/user_images/MAS-3.png&quot;&quot;data-ratio=&quot;0.5666666666666667&quot;&gt;&lt;/div&gt;&lt;/div&gt;" 

        */

        tmp = $('<div/>');
        slidesWrap.append(newBlockItems);
        slideContainer.append(slidesWrap);
        if (slideOptions['$ArrowNavigatorOptions']['$ChanceToShow'] != '0') {
            var top = height / 2;
            var arrowL = $('<span u="arrowleft" class="dyna-sitebuild-block-gallery-arrow-l"></span>');
            var arrowR = $('<span u="arrowright" class="dyna-sitebuild-block-gallery-arrow-r"></span>');
            arrowL.css('top', top + 'px');
            arrowR.css('top', top + 'px');
            slideContainer.append(arrowL);
            slideContainer.append(arrowR);
        }
        if (slideOptions['$ThumbnailNavigatorOptions']['$ChanceToShow'] != '0') {
            var itemWidth = thumbnailHeight / ratio;
            var thumbnailNavi = $('<div class="dyna-sitebuild-gallery-thumb-nav-wrap" style="margin-top:' + thumbnailTop + 'px;height:' + thumbnailHeight + 'px;"><div u="thumbnavigator" class="dyna-sitebuild-block-gallery-thumb-navi"><div class="dyna-sitebuild-block-gallery-thumb-navi-bg"></div><div u="slides" class="dyna-sitebuild-block-gallery-thumb-navi-item"><div u="prototype" class="p" style="width:' + itemWidth + 'px;"><div class="w"><div u="thumbnailtemplate" class="thumbnailtemplate"></div></div></div></div></div></div>');
            slideContainer.append(thumbnailNavi);
            var slices = width / itemWidth;
            if (slices > 1) {
                slices = Math.floor(slices);
                slideOptions['$ThumbnailNavigatorOptions']['$DisplayPieces'] = slices;
            }

        }
        tmp.append(slideContainer);
        block.find('.dyna-sitebuild-block-content').html(
            tmp.html());
        var jssor_slider = new $JssorSlider$(slideContainer.attr('id'),
            slideOptions);
        $(window).bind("resize", function(){
        	if(jssor_slider.$Elmt.parentNode != null){
        	var parentWidth = jssor_slider.$Elmt.parentNode.clientWidth;
        	if (parentWidth){
                jssor_slider.$ScaleWidth(parentWidth);
        	}}
        });
    };

    var reInitCarousel = function(block) {
        var html = block.data('html');
        var options = block.data('options');
        var ratio = block.data('ratio');
        var slideOptions = jQuery.extend(true, {}, options);
        // var slideOptions = options;

        slideOptions['$ArrowNavigatorOptions']['$Class'] = $JssorArrowNavigator$;
        var tmp = $('<div></div>');
        tmp.html(html);
        var width = block.width();
        var imageWidth = Math.floor(width * 0.8);
        var parkPosition = Math.ceil(width * 0.1);
        slideOptions['$SlideWidth'] = imageWidth;
        slideOptions['$ParkingPosition'] = parkPosition;
        var height = imageWidth * ratio;
        var slideContainer = $('<div class="dyna-sitebuild-gallery-slide-container"></div>');
        block.uniqueId();
        slideContainer.attr('id',
            'dyna-sitebuild-gallery-slide-container-' + block.attr('id'));
        var slidesWrap = $('<div class="dyna-sitebuild-gallery-slides-wrap"></div>');
        slideContainer.css('height', height + 'px');
        slidesWrap.css('height', height + 'px');
        var newBlockItems = $('<div class="dyna-sitebuild-gallery-items"></div>');
        var imgs = tmp.find('.dyna-sitebuild-gallery-item');
        newBlockItems.attr('u', 'slides');
        if (imgs.length < 3) {
            slideOptions['$DisplayPieces'] = 1;
        } else {
            slideOptions['$DisplayPieces'] = 2;
        }

        $
            .each(
                imgs,
                function() {
                    if ($(this)
                        .hasClass(
                            'dyna-sitebuild-gallery-image')) {
                        var img = $(this).find('img');
                        if (isJqueryObjectExists(img)) {
                            var src = img.attr('src');
                            if (isJqueryObjectExists(src)) {
                                var pic_real_width, pic_real_height;
                                var item = $('<div class="dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image"></div>');
                                var image = $('<img/>');
                                if (src.indexOf('?img_id') != -1) {
                                    var newSrc = src + '&w=' + imageWidth;
                                    image.attr('src', newSrc);
                                } else {
                                    image.attr('src', src);
                                }
                                var r = img.data('ratio');
                                var h = imageWidth * r;
                                if(r != ratio){
                                	image.css('margin-top', (height-h)/(2*imageWidth)*100+'%');
                                }
                                item.append(image);
                                image
                                    .attr('u',
                                        'image');

                                newBlockItems
                                    .append(item);
                            }
                        }
                    }
                });
        tmp = $('<div/>');
        slidesWrap.append(newBlockItems);
        slideContainer.append(slidesWrap);
        if (slideOptions['$ArrowNavigatorOptions']['$ChanceToShow'] != '0') {
            var top = height / 2;
            var arrowL = $('<span u="arrowleft" class="dyna-sitebuild-block-gallery-arrow-l"></span>');
            var arrowR = $('<span u="arrowright" class="dyna-sitebuild-block-gallery-arrow-r"></span>');
            arrowL.css('top', top + 'px');
            arrowR.css('top', top + 'px');
            slideContainer.append(arrowL);
            slideContainer.append(arrowR);
        }
        tmp.append(slideContainer);
        block.find('.dyna-sitebuild-block-content').html(
            tmp.html());
        var jssor_slider = new $JssorSlider$(slideContainer.attr('id'),
            slideOptions);
        $(window).bind("resize", function(){
        	if(jssor_slider.$Elmt.parentNode != null){
        	var parentWidth = jssor_slider.$Elmt.parentNode.clientWidth;
        	if (parentWidth){
                jssor_slider.$ScaleWidth(parentWidth);
        	}}
        });
    };

    var reInitGrid = function(block) {
        var html = block.data('html');
        var options = block.data('options');
        var itemPerRow = parseInt(options['$ImagePerRow']);
        var padding = parseInt(options['$Padding']);

        var tmp = $('<div></div>');
        var b_width = block.width();
        var paddingR = padding / b_width * 100;
        var img_max_w = (b_width - (padding * (itemPerRow - 1))) / itemPerRow;
        var width = img_max_w / b_width * 100;
        var aspectType = parseInt(options['$AspectRatio']);
        var paddingBottom = aspectRatios[aspectType]['ratio'];
        var img_max_h = img_max_w * paddingBottom / 100;
        tmp.html(html);
        var slideContainer = $('<div class="dyna-sitebuild-gallery-slide-container"></div>');
        block.uniqueId();
        slideContainer.attr('id',
            'dyna-sitebuild-gallery-slide-container-' + block.attr('id'));
        var newBlockItems = $('<div class="dyna-sitebuild-gallery-items"></div>');
        var imgs = tmp.find('.dyna-sitebuild-gallery-item');
        var i = 1;

        $
            .each(
                imgs,
                function() {
                    if ($(this)
                        .hasClass(
                            'dyna-sitebuild-gallery-image')) {
                        var img = $(this).find('img');
                        if (isJqueryObjectExists(img)) {
                            var src = img.attr('src');
                            var r = img.data('ratio');
                            var w = img_max_w;
                            var h = img_max_h;
                            if ((r*100) < paddingBottom) {// h<w
                            	h = w * r;
                            } else {
                            	w = h / r;
                            }
                            if (isJqueryObjectExists(src)) {
                                
                                var item = $('<div class="dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image"></div>');
                                item.css('margin-bottom', paddingR + '%');
                                if (itemPerRow > 1 && i % itemPerRow != 0) {
                                    item.css('margin-right', paddingR + '%');
                                }
                                item.css('width', width + '%');
                                var itemFit = $('<a class="dyna-sitebuild-gallery-item-fit"></a>');
                                itemFit.css('padding-bottom', paddingBottom + '%');
                                if (options['$Lightbox']) {
                                    itemFit.attr('href', src);
                                    itemFit.attr('data-lightbox', 'dyna-gallery-' + block.attr('id'));
                                }
                                var image = $('<img/>');
                                if (src.indexOf('?img_id') != -1) {
                                    var newSrc = src + '&w=' + w;
                                    image.attr('src', newSrc);
                                } else {
                                    image.attr('src', src);
                                }
                                image.css({
                                    width: w / img_max_w * 100 + '%'
                                });
                                if (w < img_max_w) {
                                    var marginR = (100 - (w / img_max_w * 100)) / 2;
                                    image.css('margin-right', marginR + '%');
                                }
                                if (h < img_max_h) {
                                    var marginT = (img_max_h - h) * 50 / img_max_w;
                                    image.css('margin-top', marginT + '%');
                                }
                                itemFit.append(image);
                                item.append(itemFit);
                                newBlockItems
                                    .append(item);
                            }
                        }
                    }
                    i = i + 1;
                });
        tmp = $('<div/>');
        slideContainer.append(newBlockItems);
        tmp.append(slideContainer);
        block.find('.dyna-sitebuild-block-content').html(
            tmp.html());
    };

    var reInitStack = function(block) {
        var html = block.data('html');
        var tmp = $('<div></div>');
        tmp.html(html);
        var slideContainer = $('<div class="dyna-sitebuild-gallery-slide-container"></div>');
        block.uniqueId();
        slideContainer.attr('id',
            'dyna-sitebuild-gallery-slide-container-' + block.attr('id'));
        var width = block.width();
        var newBlockItems = $('<div class="dyna-sitebuild-gallery-items"></div>');
        var imgs = tmp.find('.dyna-sitebuild-gallery-item');
        $
            .each(
                imgs,
                function() {
                    if ($(this)
                        .hasClass(
                            'dyna-sitebuild-gallery-image')) {
                        var img = $(this).find('img');
                        if (isJqueryObjectExists(img)) {
                            var src = img.attr('src');
                            if (isJqueryObjectExists(src)) {
                                
                                var item = $('<div class="dyna-sitebuild-gallery-item dyna-sitebuild-gallery-image"></div>');
                                var image = $('<img/>');
                                if (src.indexOf('?img_id') != -1) {
                                    var newSrc = src + '&w=' + width;
                                    image.attr('src', newSrc);
                                } else {
                                    image.attr('src', src);
                                }
                                item.append(image);
                                newBlockItems
                                    .append(item);
                            }
                        }
                    }

                });
        tmp = $('<div/>');
        slideContainer.append(newBlockItems);
        tmp.append(slideContainer);
        block.find('.dyna-sitebuild-block-content').html(
            tmp.html());
    };
    
    var reInitialCarousel = function(block, carouselArr, defaultOptions, buttonStyle) {
        var slideContainer = $('<div class="dyna-sitebuild-carousel-slide-container ' + $("#dyna-sitebuild-site-top-rest-background").attr("class") + '"></div>'),
            slidesWrap = $('<div class="dyna-sitebuild-carousel-slides-wrap"></div>'),
            height = block.height();
        slideContainer.attr("id", "sitebuild-site-top-rest-background-slide-container");
        slideContainer.css("height", height + "px");
        slidesWrap.css("height", height + "px");
        var newBlockItems = $('<div class="dyna-sitebuild-carousel-items"></div>');
        for (carousel in carouselArr) {
        	var item = $('<div class="dyna-sitebuild-carousel-item dyna-sitebuild-carousel-image"></div>'),
                image = $("<img/>");
            item.attr("id", carouselArr[carousel].itemId);
            item.attr("style", 'background-image: url("' + carouselArr[carousel].imagePath + '"); background-size: cover; background-position: center center; background-repeat: no-repeat;');
            if (carouselArr[carousel].topRest != null) {
            	var top_rest = createTopRest(carouselArr[carousel].topRest, buttonStyle);
            	item.append(top_rest);
            }
            newBlockItems.append(item)
        }
        newBlockItems.attr("u", "slides");
        slidesWrap.append(newBlockItems);
        slideContainer.append(slidesWrap);
        if ("0" != defaultOptions.$BulletNavigatorOptions.$ChanceToShow) {
        	var jssorb21 = $('<div u="navigator" class="jssorb21" style="bottom: 26px; right: 6px;"><div u="prototype"></div></div>');
        	slideContainer.append(jssorb21)
        }
        var tmp = $("<div/>");
        tmp.append(slideContainer);
        block.append(tmp.html());
        defaultOptions.$BulletNavigatorOptions.$Class = $JssorBulletNavigator$;
        var jssor_slider = new $JssorSlider$(slideContainer.attr("id"), defaultOptions),
            items = $("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-item"),
            paddings =  Number($("#dyna-sitebuild-site-top-nav-background").css("padding-top").replace("px", "")) + Number($("#dyna-sitebuild-site-top-nav-background").css("padding-bottom").replace("px", ""));
        $("#sitebuild-site-top-rest-background-slide-container").css({"position": "absolute", "top": "0"});
        var originalWidth = jssor_slider.$Elmt.parentNode.clientWidth,
        	originalHeight = jssor_slider.$Elmt.parentNode.clientHeight;
    	    navOffsetHeight = document.getElementById("dyna-sitebuild-site-top-nav-background").offsetHeight,
        	parentHeight = document.getElementById("dyna-sitebuild-site-top-background-container").offsetHeight,
        	logoImage = $("#dyna-sitebuild-site-head.dyna-sitebuild-site-img-head img");
        $("#dyna-sitebuild-site-top-background").css("background-image", "none");
        $("#sitebuild-site-top-rest-background-slide-container").css({"height": parentHeight + "px", "overflow": "hidden"});
        $.each(items, function() {
            $(this).children(".dyna-sitebuild-site-top-rest").css({"padding-top": navOffsetHeight + "px", "height": parentHeight - navOffsetHeight + "px"})
        });
        $("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-item").css("height", (parentHeight + paddings) + "px");
        if (isJqueryObjectExists(logoImage)) {
        	$(logoImage).load(function() {
        		parentHeight = document.getElementById("dyna-sitebuild-site-top-background-container").offsetHeight;
        		navOffsetHeight = document.getElementById("dyna-sitebuild-site-top-nav-background").offsetHeight;
        		$("#sitebuild-site-top-rest-background-slide-container").css({"height": parentHeight + "px", "overflow": "hidden"});
        		$.each(items, function() {
		            $(this).children(".dyna-sitebuild-site-top-rest").css({"padding-top": navOffsetHeight + "px", "height": parentHeight - navOffsetHeight + "px"})
		        });
		        $("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-item").css("height", (parentHeight + paddings) + "px");
        	})
        }
        $("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-items").css("overflow", "visible");
        $(window).bind("resize", function() {
        	var restWidth = $("#dyna-sitebuild-site-top-background").width();
            if (null != jssor_slider.$Elmt.parentNode) {
	            var parentWidth = $("#dyna-sitebuild-site-top-background").width(),
	            	parentHeight = jssor_slider.$Elmt.parentNode.clientHeight,
	            	radio = restWidth / originalWidth,
	            	navOffsetHeight = document.getElementById("dyna-sitebuild-site-top-nav-background").offsetHeight,
	    			restRadio = 1 / radio,
	    			sliderHeight = parentHeight * radio,
	    			navHeight = document.getElementById("dyna-sitebuild-site-top-nav-background").offsetHeight;
    			 if (originalHeight != parentHeight) {
    			 	originalHeight = parentHeight;
		    		$("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-item").css("height", parentHeight + "px");
    			 }
	    		 if (originalWidth < restWidth) {
	    		 	parentWidth && jssor_slider.$ScaleWidth(parentWidth)
	    			$("#sitebuild-site-top-rest-background-slide-container").children("div").css("transform", "scale(" + restWidth / originalWidth + ")");
	    			$("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-site-top-rest").css({"transform": "scale(" + restRadio + ")", "margin-top": ((parentHeight - sliderHeight) / 2 * restRadio) + "px", "height": parentHeight - navOffsetHeight + "px"})
	        		$("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-carousel-item").css("left", "0px");
	        		$("#sitebuild-site-top-rest-background-slide-container").css({"height": parentHeight + "px", "width": "100%"});
	    		 } else {
	    		 	parentHeight && jssor_slider.$ScaleHeight(parentHeight)
	    		 	$("#sitebuild-site-top-rest-background-slide-container").children("div").css("transform", "scaleX(" + restWidth / originalWidth + ")");
	    		 	$("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-site-top-rest").css({"transform": "scaleX(" + restRadio + ")", "margin-top": "0px", "height": parentHeight - navOffsetHeight + "px"})
	    		 	$("#sitebuild-site-top-rest-background-slide-container").css({"height": parentHeight + "px", "width": "100%"});
	    		 }
            }
            $("#sitebuild-site-top-rest-background-slide-container .jssorb21").css({"transform": "scale(1)", "bottom": ($("#sitebuild-site-top-rest-background-slide-container").height() - document.getElementById("dyna-sitebuild-site-top-background").offsetHeight + 26) + "px", "left": ($("#dyna-sitebuild-site-top-background").width() - $("#sitebuild-site-top-rest-background-slide-container .jssorb21").width()) / 2 + "px"});
        	$("#sitebuild-site-top-rest-background-slide-container .dyna-sitebuild-site-top-rest").css({"width": restWidth + "px", "position": "absolute", "right": restWidth > 1000 ? "calc(50% - 500px)" : "initial", "padding-top": navHeight + "px", "left": (restWidth > 1000 ? "initial" : (-restWidth * (1-restRadio) / 2 + "px"))});
        })
    }
    
    var createTopRest = function(data, buttonStyle) {
        var top_rest = $('<div class="dyna-sitebuild-site-top-rest"></div>'),
            rest_wapper = $('<div class="dyna-sitebuild-site-top-rest-wrap"></div>'),
            rest_head =  $('<div class="dyna-sitebuild-site-top-rest-head"></div>'),
            rest_sub = $('<div class="dyna-sitebuild-site-top-rest-sub"></div>'),
            button_wapper = $('<div class="dyna-sitebuild-site-top-rest-button-wrap"></div>'),
            button_text = $('<div class="'+ (buttonStyle == 0 ? 'solid' : 'outline') +' dyna-sitebuild-site-top-rest-button-text"></div>'),
            button_linked = $('<a class="dyna-sitebuild-site-top-rest-button"></a>');
    	if (null == data.linked_btn) {
    		button_linked.attr("href", "#")
    	} else {
    		var url = data.linked_btn;
    		url = 0 == url.indexOf("/") || 0 == url.indexOf("http://") || 0 == url.indexOf("https://") || "#" == url ? url : "http://" + url;
	        button_linked.attr("href", url);
    	}
        null == data.btn_text ? button_text.html("") : button_text.html(data.btn_text);
        null == data.sub_caption ? rest_sub.html("") : rest_sub.html(data.sub_caption);
        null == data.caption ? rest_head.html("") : rest_head.html(data.caption);
        button_linked.append(button_text);
        button_wapper.append(button_linked);
        rest_wapper.append(rest_head);
        rest_wapper.append(rest_sub);
        (isJqueryObjectExists(data.linked_btn) || isJqueryObjectExists(data.btn_text)) && rest_wapper.append(button_wapper);
        top_rest.append(rest_wapper);
        return top_rest
    }
    
    return {
        reInit: function() {
            $.each($('.dyna-sitebuild-block-gallery'), function() {
            	var datas = $(this).data();
            	for(var name in datas){
            		var value = datas[name];
            		$(this).removeAttr('data-'+name);
            		$(this).data(name, value);
            	}
                reInitialGallery($(this));
            });
            
            $.each($('.dyna-sitebuild-block-instagram'), function() {
            	var datas = $(this).data();
            	for(var name in datas){
            		var value = datas[name];
            		$(this).removeAttr('data-'+name);
            		$(this).data(name, value);
            	}
                reInitialGallery($(this));
            });
            
            var $headerCarousel = $("#dyna-sitebuild-site-top-rest-background"),
		    	bgOptions = $headerCarousel.attr("data-bg-options"),
		    	isFree = $headerCarousel.attr("data-bg-free"),
		    	buttonStyle = $headerCarousel.attr("data-bg-button-style");
			if (isJqueryObjectExists(bgOptions)) {
				if (isJqueryObjectExists(isFree) && isFree == "false") {
			    	var currentBgOptions = eval("("+ bgOptions +")"),
			    		carouselArr = currentBgOptions.carousel.carouselItem;
			    	if (isJqueryObjectExists(currentBgOptions.carousel.option)) {
			    		var defaultOptions = currentBgOptions.carousel.option;
			    		currentBgOptions.active == 1 && reInitialCarousel($("#dyna-sitebuild-site-top-background"), carouselArr, defaultOptions, buttonStyle);
			    	}
				}
		    	$headerCarousel.removeAttr("data-bg-free");
		    	$headerCarousel.removeAttr("data-bg-options");
		    	$headerCarousel.removeAttr("data-bg-button-style");
		    }
        }
    }
})(jQuery);
