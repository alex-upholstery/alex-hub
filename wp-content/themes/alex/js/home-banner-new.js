jQuery(document).ready(function ($) {
    var bannerSwiper,
    promotionsSwiper,
    swiperSlidesTimer;

    //banner js
    function QRcodeShowTpye(){            
        $('.banner_wrapper').off('mouseenter mouseleave click');
        if(window.innerWidth >= 950){
            $('.banner_wrapper').on('mouseenter', '.QRcode-box', function() {
                $(this).find('.download-img').addClass('animate__zoomIn');
                $(this).find('.download-img').css('display', 'block');
            });
        
            $('.banner_wrapper').on('mouseleave', '.QRcode-box', function() {
                $(this).find('.download-img').removeClass('animate__zoomIn');
                $(this).find('.download-img').css('display', 'none');
            });
        }else{
            $('.banner_wrapper').on('click', '.QRcode-box', function() {
                var $this = $(this);
                const $downloadContainer = $('.download-box .download_container')
                $downloadContainer.empty();
                var downloadImgClone = $this.find(".download-img").clone();
                downloadImgClone.appendTo($downloadContainer);
                $downloadContainer.append('<img src="https://d21u74ttq7jqzf.cloudfront.net/image/home_btn_close.webp" alt="" class="home_btn_close">');
                $('.download_container .download-img').css('display', 'block');
                $(".download-box").fadeIn(300);
            });
        }
        $('.download-box').on('click', '.home_btn_close', function () {
            $(".download-box").fadeOut(300);
        });
    }

    // bannerSwiper = new Swiper('.home-banner-swiper', {
    //     // autoplay: true,//可选选项，自动滑动
    //     // delay: 5000,
    //     // loop: true,
    //     effect: 'fade',
    //     autoHeight: true,
    //     allowTouchMove: false,
    //     navigation: {
    //         nextEl: '.banner_next',
    //     },
    // })

    var swiperWrapper = $('.home-banner-bottom .swiper-wrapper');
    var slideCount = swiperWrapper.children().length;
    var originalSlides = swiperWrapper.children().clone();
    if (slideCount === 2) {
        swiperWrapper.append(originalSlides.clone());
        swiperWrapper.append(originalSlides.clone());
    } else if (slideCount === 3 || slideCount === 4) {
        swiperWrapper.append(originalSlides.clone());
    }
    
    promotionsSwiper = new Swiper('.banner-promotions-swiper', {
        loop: true,
        slidesPerView : 'auto',  
        spaceBetween: 20,
        autoplay: true,
        delay: 5000,
        navigation: {
            nextEl: '.proms-button-next',
            prevEl: '.proms-button-prev',
        },
    })

    promotionsSwiper.on('slideChange', function () {
        var tipsText = promotionsSwiper.slides[promotionsSwiper.activeIndex].querySelector('.text').innerHTML;
        $('.tips-box').attr('href', promotionsSwiper.slides[promotionsSwiper.activeIndex].querySelector('a').href);
        $('.tips-box .tipsText').html(tipsText);
    });
    $('.home-banner-bottom .swiper-slide').hover(function () {
        var tipsText = $(this).find('.text').html();
        $('.tips-box').attr('href', $(this).find('a').attr('href'));
        $('.tips-box .tipsText').html(tipsText);
    });
    $('.banner-promotions-swiper').on('mouseenter', function () {
        promotionsSwiper.autoplay.stop();
    });
    $('.banner-promotions-swiper').on('mouseleave', function () {
        promotionsSwiper.autoplay.start();
    });
    
    function promotionsSwiperScroll(){
        if(window.innerWidth >= 768){
            promotionsSwiper.params.spaceBetween = 16;
            promotionsSwiper.update();
        }
    }
    promotionsSwiperScroll();
    QRcodeShowTpye();
    $(window).bind('resize', function (){
        if (swiperSlidesTimer) clearTimeout(swiperSlidesTimer);
        swiperSlidesTimer = setTimeout(function(){
            promotionsSwiperScroll();
            QRcodeShowTpye();
        } , 200);
    });

    var countryCode = getCookie('wordpress_country_code')
    if(window.location.href.indexOf('http://www.vantagemarkets.io/') !== -1 && current_language == 'en'){
        $('.mip_088').hide();
        if(countryCode == 'MY'){
            $('.mip_088').show();
        }
    }

    if(countryCode == 'IN' && current_language == 'en'){
        $('.august_box').show();
    } else {
        $('.august_box').hide();
    }

    const emailReg = /^[-_A-Za-z0-9]+([-_.][_A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,7}$/;
    let source_url = encodeURIComponent(location.href);
    function verifyEmail(email) {
        if (email == "" || !emailReg.test(email) || email.length > 60) {
            setTimeout(function () { $('.input-box').addClass('hasError'); }, 100)
            return false;
        } else {
            setTimeout(function () { $('.input-box').removeClass('hasError'); }, 100)
            return true;
        }
    }
    $(".home-banner-swiper").on('click', '.banner-btn', function(){
        var bannerInputVal = $(this).siblings(".input-box").find(".live-input").val();
        var isVal =  verifyEmail(bannerInputVal)
        if(isVal){
            $.ajax({
                type: "POST",
                url: "/data/get_convert_form.php?v=" + Data(),
                data: "email=" + bannerInputVal + "&link=" + source_url + "&type=home",
                dataType: "text",
                success: function (msg) {
                    console.log(msg);
                    window.location.href = current_webUrl + "/open-live-account/";
                }
            })
            sessionStorage.setItem('bannerInputVal', bannerInputVal);
        }
    });
    //banner js end
    function updateDOM() {
        $(".banner_wrapper .slide_one").css('opacity', '1');
        $('.home-banner-top .loding').hide();
    }
    updateDOM();

})