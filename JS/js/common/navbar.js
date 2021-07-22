$(document).ready(function() {
    var checkNavbar = true;
    if ($(window).width() >= 900) {
        checkNavbar = true;
    } else {
        checkNavbar = false;
    }
    $('.toggle-icon').on("click", function() {
        checkNavbar = !checkNavbar;

        if (checkNavbar == true) { //show navbar
            $(".nav-item-text").css({ 'opacicty': '1', 'transition': '500ms' });
            $('.navbarweb').css({
                'width': '225px',
                'transition': '500ms'
            });
            $('.content').css({
                'width': 'calc(100% - 226px)',
                'transition': '500ms',
                'left': '226px'
            });
            $('.logo-site').css('border-bottom', 'none');
        } else {
            if (checkNavbar == false) { // not show navbar
                $('.navbarweb').css({
                    'width': '51px',
                    'transition': '500ms'
                });
                $(".nav-item-text").css({ 'opacicty': '0', 'transition': '500ms' });
                $('.logo-site').css('border-bottom', '1px solid #e5e5e5');
                $('.content').css({
                    'width': 'calc(100% - 51px)',
                    'transition': '500ms',
                    'left': '51px'
                });
            }
        }
    })
})