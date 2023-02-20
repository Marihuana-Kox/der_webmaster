$(function(){
    // $('body').hide();
    function size_window() {
        if ($(window).width() < 1200 ){
            $('.dextop__meny').addClass('burger__meny')
            $('.burger__meny').removeClass('dextop__meny')
        }else{
            $('.burger__meny').addClass('dextop__meny')
            $('.dextop__meny').removeClass('burger__meny')
        }
    }
    
    $('.burger').toggle( function() {
        $('.burger__meny').css('display', 'block');
    }, function() {
        $('.burger__meny').css('display', 'none');
    })

    $(window).resize(size_window)
})
