// JavaScript Document
// ---------------
// ROW & APAC 都是VFSC 监管
// AU 是ASIC
// UK 是FCA
// JP SVG
// ---------------
// resize fangdou
function debounce(fn, delay) {

    var timer = null;
    return function() {

        clearTimeout(timer)
        timer = setTimeout(function() {
            fn.apply(this)
        }, delay)
    }
}

function throttle(fn, interval, options = { leading: true, trailing: false }) {
    const { leading, trailing, resultCallback } = options
    let lastTime = 0
    let timer = null
    const _throttle = function(...args) {
      return new Promise((resolve, reject) => {
        const nowTime = new Date().getTime()
        if (!lastTime && !leading) lastTime = nowTime
        const remainTime = interval - (nowTime - lastTime)
        if (remainTime <= 0) {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
          const result = fn.apply(this, args)
          if (resultCallback) resultCallback(result)
          resolve(result)
          lastTime = nowTime
          return
        }

        if (trailing && !timer) {
          timer = setTimeout(() => {
            timer = null
            lastTime = !leading ? 0: new Date().getTime()
            const result = fn.apply(this, args)
            if (resultCallback) resultCallback(result)
            resolve(result)
          }, remainTime)
        }
      })
    }
    _throttle.cancel = function() {
      if(timer) clearTimeout(timer)
      timer = null
      lastTime = 0
    }
    return _throttle
}

// denggao
function setEqualHigh(className) {
    className.startsWith('.') ? '' : (className = '.' + className);
    let heightList = []
    jQuery(className).each(function() {
            heightList.push(jQuery(this).height())
    })
    let maxNum = Math.max.apply(null, heightList);
    let minNum = Math.min(...heightList);
    if (maxNum > minNum) {
        jQuery(className).each(function() {
                jQuery(this).height(maxNum);
        })
    }
}

(function($) {
$.fn.exist = function(){ 
    if($(this).length>=1){
    return true;
    }
    return false;
};
})(jQuery);

// Disable page scrolling
function stopScroll(){
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
}
// Enable page scrolling
function startScroll(){
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
}
var loadAllState = true;
jQuery(document).ready(function ($) {
    if(loadAllState){
        // stopScroll();
    }

    $('.nav-bars').click(function() {
        $(this).toggleClass('active');
        $('.nav-menu-academy-tab').fadeToggle();
    });
    $('.nav-mobile-bars').click(function() {
        $('.open-state-menu').addClass('active');
        $('body').addClass('nav-mobile-scroll');
    })
    $('.nav-mobile-close').click(function() {
        $('.open-state-menu').removeClass('active');
        $('body').removeClass('nav-mobile-scroll');
    })

    $('.header-mobile .mobile-menu-theme').click(function() {
        $(this).parent().toggleClass('active')
        $(this).siblings('.mobile-menu-theme-link').slideToggle()
        $(this).siblings('.mobile-menu-list').slideToggle()
    })
	
	function back_to_top_showSc(){
		var document_height = (document.documentElement.clientHeight);
		if($(window).scrollTop() >= document_height / 2) {
			$(".page-tool-bar-usual li.back-to-top").addClass('show');
		}else {										
			$(".page-tool-bar-usual li.back-to-top").removeClass('show');
		}
	}
    $('.back-to-top').click(function(){
        $("html:not(:animated),body:not(:animated)").animate({ scrollTop: 0 }, 1000);
        return false;
    });
	
    $('.media-share').click(function(){
        $('.page-tool-bar-media').addClass('active');
    })
    $('.page-tool-bar-media-close').click(function(){
        $('.page-tool-bar-media').removeClass('active');
    })

    if(!$('.secondary-menu-item').exist()){
        $('.secondary-menu').addClass('bcn-expand');
    } 

    $('header .nav-language').click(function() {
        $(".header-language-mask-layer").fadeIn("fast");
        $(".header-language-bar").fadeIn("fast");
        // stopScroll();
    })

    $(".header-language-mask-layer").click(function () {
        $(this).fadeOut("fast");
        $(".header-language-bar").fadeOut("fast");
        // startScroll();
    });
    
    $('.header-language-bar .language-bar-content-title button').click(function() {
        $(".header-language-mask-layer").fadeOut("fast");
        $(".header-language-bar").fadeOut("fast");
        // startScroll();
    });

    function headerH(){
        var headerH = $('header').height();
        $('body').css("margin-top",headerH);
    }

    function headerShadow(){
        if($(document).scrollTop() > 0 ){
            $('header').addClass('scroll-shadow');
        }else{
            $('header').removeClass('scroll-shadow');
        }
    }

    headerH();
    headerShadow();
    $(document).ready(function() {
        headerH();
    });
    $(window).on('load',function(){
        headerH();		
		back_to_top_showSc();
    })
    $(window).resize(function () {
        headerH();
		back_to_top_showSc();
    })
    $(window).scroll(function () {
        headerShadow();
		back_to_top_showSc();
	});

    wow = new WOW({
        boxClass:     'animates',
        animateClass: 'animated.min',
        offset:       120,
        mobile:       false,
        live:         true
    })
    wow.init();

    $('.primary-category').click(function(){
        try{
            sensors.track('Web_Navigation_Click', {
                primary_category: $(this).attr('data-web-data'),
    
                event_name_string : 'Web_Navigation_Click'
            });


        } catch(error){
            console.log(error);
        }
    })
    $('.secondary-category').click(function(){
        let vaule = $(this).attr('data-web-data').split('_')
        try{
            sensors.track('Web_Navigation_Click', {
                primary_category: vaule[0],
                secondary_category: vaule[1],
    
                event_name_string : 'Web_Navigation_Click'
            });


        } catch(error){
            console.log(error);
        }
    })
    $('.tertiary-category').click(function(){
        let vaule = $(this).attr('data-web-data').split('_')
        try{
            sensors.track('Web_Navigation_Click', {
                primary_category: vaule[0],
                secondary_category: vaule[1],
                tertiary_category: vaule[2],
                event_name_string : 'Web_Navigation_Click'
            });


        } catch(error){
            console.log(error);
        }
    })
	
});

addEventListener("load",function(){
    jQuery('.vau-loading-wrapper').hide();
    // startScroll();
    loadAllState = false;

    window.tradeSmarterCanvasImg = true;
    window.gtmDefer = true;
})

var url_data_p_chat = window.location.pathname;
var str_lans_chat = url_data_p_chat.split("/")[1];
