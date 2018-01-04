'use strict';

requirejs([
	'jquery' , 'swiper', 'countUp', 'slick'
], function ($, swiper, CountUp, slick){

	var doc = $(document);
	var win = $(window);
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
		autoplayDisableOnInteraction: true,
		autoHeight: true,
		keyboardControl: true
	});

	new swiper('.swiper-item-plan', {
		pagination: '.swiper-pagination2',
		paginationClickable: true,
		preloadImages: true,
		slidesPerView: 1,
		loop: autoPlay,
		autoplay: 3500,
		autoplayDisableOnInteraction: true,
		autoHeight: true,
		keyboardControl: true
	});


	var count_whole_item = parseInt($('.count_whole_item').val());
	var count_current_item = parseInt($('.count_current_item').val());
	var count_accum_item = parseInt($('.count_accum_item').val());
	var count_accum_info = parseInt($('.count_accum_info').val());
	var count_car_info = parseInt($('.count_car_info').val());

	// el, startNum, endNum
	var numAnim1 = new CountUp("countAllItem", 0, count_whole_item);
	var numAnim2 = new CountUp("current_item_count", 0, count_current_item);
	var numAnim3 = new CountUp("accum_item_count", 0, count_accum_item);
	var numAnim4 = new CountUp("count_accum_price", 0, count_accum_info);
	var numAnim5 = new CountUp("count_car_item", 0, count_car_info);
	var callBooelan = false;
	var chadaeliGraph = $('.chadaeli-graph');
	var countElPosY = getElementOffsetY(chadaeliGraph);


	// onload 이벤트는 document객체가 아니라 window 객체에만 작용한다??
	win.bind('load', function () {
		var windowSize = parseInt(getWindowHeight());
		var scrollY = parseInt(getScrollYPos());

		if( (countElPosY < windowSize) || (scrollY+windowSize > countElPosY)){
			if(!callBooelan) {
				callCountModule();
			}
		}
	});

	doc.bind('scroll', function () {
		var windowSize = parseInt(getWindowHeight());
		var scrollY = parseInt(getScrollYPos());
		if( (countElPosY < windowSize) || (scrollY+windowSize > countElPosY)){
			if(!callBooelan) {
				callCountModule();
			}
		}
	});


	/**
	 * Get Scroll posY
	 * @returns {*}
	 */
	function getScrollYPos(){
		return doc.scrollTop();
	}

	/**
	 * Get Window height
	 * @returns {*}
	 */
	function getWindowHeight(){
		return win.height();
	}

	function getElementOffsetY(el){
		return el.offset().top;
	}

	/**
	 * Call CountAni
	 */
	function callCountModule(){
		if (!numAnim1.error) {
			numAnim1.start();
		} else {
			console.error(numAnim1.error);
		}

		if (!numAnim2.error) {
			numAnim2.start();
		} else {
			console.error(numAnim2.error);
		}

		if (!numAnim3.error) {
			numAnim3.start();
		} else {
			console.error(numAnim3.error);
		}

		if (!numAnim4.error) {
			numAnim4.start();
		} else {
			console.error(numAnim4.error);
		}

		if (!numAnim5.error) {
			numAnim5.start();
		} else {
			console.error(numAnim5.error);
		}

		callBooelan = true;
	}


	// test slick carousel for store and livethecar
	$('.store-carousel').slick({
		autoplay: true,
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		lazyLoad: 'ondemand',
		autoplaySpeed : 3500,
		prevArrow : $('.store-prev'),
		nextArrow : $('.store-next'),
		draggable: true,
		pauseOnHover: true,
		pauseOnFocus : true
	});

	$('.livethecar-carousel').slick({
		autoplay: true,
		infinite: true,
		slidesToShow: 3.4,
		slidesToScroll: 1,
		lazyLoad: 'ondemand',
		autoplaySpeed : 3800,
		prevArrow : $('.live-prev'),
		nextArrow : $('.live-next'),
		draggable: true,
		pauseOnHover: true,
		pauseOnFocus : true
	});



});