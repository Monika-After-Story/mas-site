
$(function() {
    $('.social-wrap .social-element').each(function() {
        if (Boolean($(this).children('div.social-element-wrap').html()) && !Boolean($(this).find('a').html())) {
            $(this).hasClass('social-fb') ? $(this).find('a').html('<i class="fa fa-facebook"></i>') :
                $(this).hasClass('social-twitter') ? $(this).find('a').html('<i class="fa fa-twitter"></i>') :
                $(this).hasClass('social-linkedin') ? $(this).find('a').html('<i class="fa fa-linkedin-square"></i>') :
                $(this).hasClass('social-gplus') ? $(this).find('a').html('<i class="fa fa-google-plus"></i>') :
                $(this).hasClass('social-pinterest') ? $(this).find('a').html('<i class="fa fa-pinterest-p"></i>') :
                $(this).hasClass('social-youtube') ? $(this).find('a').html('<i class="fa fa-youtube"></i>') :
                $(this).hasClass('social-instagram') ? $(this).find('a').html('<i class="fa fa-instagram"></i>') :
                $(this).hasClass('social-vimeo') ? $(this).find('a').html('<i class="fa fa-vimeo"></i>') :
                $(this).hasClass('social-email') ? $(this).find('a').html('<i class="fa fa-envelope-o"></i>') :
                $(this).hasClass('social-houzz') ? $(this).find('a').html('<i class="fa fa-houzz"></i>') : '';
        }
    });
});