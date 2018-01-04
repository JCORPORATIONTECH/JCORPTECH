'use strict';

requirejs([
	'jquery' , 'swiper'
], function ($, swiper){
	
	
	var swipeOjb = $('.swiper-wrapper .swiper-slide');
	var autoPlay = false;
	var _pagenation = $('.swiper-container .swiper-pagination');
	var _swiperButtonPrev = $('.swiper-button-prev');
	var _swiperButtonNext = $('.swiper-button-next');
	
	if(swipeOjb.length > 1){
		autoPlay = true;
	}else{
		_pagenation.addClass('blind');
		_swiperButtonPrev.addClass('blind');
		_swiperButtonNext.addClass('blind');
	}
	
	new swiper('.swiper-container', {
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		pagination: '.swiper-pagination',
		paginationClickable: true,
		preloadImages: true,
		slidesPerView: 1,
		loop: autoPlay,
		autoplay: 3000,
		autoplayDisableOnInteraction: false,
		autoHeight: true,
		keyboardControl: true
	});
	
	
	var
		video_section = $('.video_section .iframe_video'),
		dealer_section = $('.iframe_video_dealer'),
		modulus = 0.54,
		max_width = 1200,
		max_height = 500,
		win = $(window);
	
	win.bind('resize', function () {
		var window_width = win.width();
		if(window_width < max_width){
			// console.log( window_width*modulus );
			video_section.attr('height', window_width*modulus );
			dealer_section.attr('height', window_width*modulus );
			
		}else{
			video_section.attr('height', max_height );
			dealer_section.attr('height', max_height );
			
		}
	});
	
	win.bind('load', function () {
		var window_width = win.width();
		if(window_width < max_width){
			// console.log( window_width*modulus );
			video_section.attr('height', window_width*modulus );
			dealer_section.attr('height', window_width*modulus );
		}else{
			video_section.attr('height', max_height );
			dealer_section.attr('height', max_height );
		}
	});
	
	
	var
		btnPerformance = $('.btn-view-performance'),
		view_performance_resource = $('.view_performance_resource'),
		bg_modal_cover = $('.bg_modal_cover'),
		_document = $(document);
	
	btnPerformance.bind('click', function (e) {
		e.preventDefault();
		view_performance_resource.css('top', currentScrollPosY(100));
		view_performance_resource.removeClass('blind');
		bg_modal_cover.css('height', _document.height());
		bg_modal_cover.removeClass('blind');
	});
	
	
	function currentScrollPosY(top){
		return parseInt(_document.scrollTop()) + top;
	}
	
	
	bg_modal_cover.bind('click', function(){
		$(this).addClass('blind');
		view_performance_resource.addClass('blind');
		
	});
	
	
});