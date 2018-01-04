'use strict';

requirejs(['jquery'], function ($) {
	
	var menu_body = $('.st_header, .st_header_m');
	var menuChangePosY = 150;
	var st_menu_list = $('.st_menu_list');
	var st_menu_link = $('.st_menu_link');
	
	/**
	 * 스크롤 위치 찾기
	 */
	function getPosYScroll(){
		return $(window).scrollTop();
	}
	
	function getWindowHeight() {
		return $(window).height();
	}
	
	// 위치에 따라서 네비 배경을 조절
	function getPosYController(){
		var posY = getPosYScroll();
		
		if(posY > menuChangePosY){
			menu_body.addClass('st_bg_menu_active');
		}else{
			menu_body.removeClass('st_bg_menu_active');
		}
	}
	
	/**
	 * 스크롤 위치 범위에 따라서 메뉴의 색상을 변경한다.
	 */
	$(window).bind('scroll', function () {
		getPosYController(); // bgController
		checkPosAndActiveMenu(); // menuActiveController
	});
	
	$(window).bind('load', function () {
		getPosYController();
		checkPosAndActiveMenu();
	});
	
	$(window).bind('resize', function () {
		getPosYController();
		checkPosAndActiveMenu();
	});
	
	
	/**
	 * 각 메뉴를 선택하면 해당 섹션으로 애니메이션을 넣어서 이동할 수 있도록 한다
	 */
	var body = $('html, body');
	var movePosByMenu = $('.movePosByMenu');
	
	var micro_nav = {
		ceo : $('.btn-ceo-section'),
		store : $('.btn-store-section'),
		item : $('.btn-items-section'),
		dealer : $('.btn-dealer-section'),
		map : $('.btn-map-section')
	};
	
	var elPos = {
		ceo : $('.st_ceo_introduce'),
		store : $('.st_store_intro'),
		item : $('.st_store_items'),
		dealer : $('.st_store_crew'),
		map : $('.st_map_place')
	};
	
	
	micro_nav.ceo.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(checkElementPosTop(elPos.ceo));
	});
	
	micro_nav.store.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(checkElementPosTop(elPos.store));
	});
	
	micro_nav.item.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(checkElementPosTop(elPos.item));
	});
	
	micro_nav.dealer.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(checkElementPosTop(elPos.dealer)-140);
	});
	
	micro_nav.map.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(checkElementPosTop(elPos.map)-120);
	});
	
	
	// 각 엘리먼트를 위치를 찾는 함수
	function checkElementPosTop(el){
		return el.offset().top;
	}
	
	// 엘리먼트로 이동하는 함수
	function moveToPosY(posY){
		body.stop().animate({scrollTop: posY}, 500, 'swing');
	}
	
	// 모든 엘리먼트의 위치를 찾아서 리턴
	function checkAllElementPosTop(){
		var elsPos = [];
		
		// movePosByMenu 순서를 돌면서 위치를 파악할 수 있도록 한다.
		movePosByMenu.each(function (i) {
			// console.log(checkElementPosTop($(this)));
			if(i !== 0){
				elsPos.push(checkElementPosTop($(this))-150);
			}else{
				elsPos.push(checkElementPosTop($(this)));
			}
		});
		
		return elsPos;
	}
	
	/**
	 * 어느 범위에 있는지 판단하여 해당 메뉴에 active가 처리될 수 있도록 한다
	 */
	function checkPosAndActiveMenu(){
		// 각 범위를 계산하여 배열에 저장한다
		// 현재 스크롤이 어느 범위에 있는 판단한다
		var elsPos = checkAllElementPosTop();
		var currentPosY = getPosYScroll();
		var pos = null;
		
		for(var i=0;i<elsPos.length-1;i++){
			if(i < elsPos.length-1){
				
				if(elsPos[i] <= currentPosY && currentPosY <= elsPos[i+1]){
					pos = i;
					break;
				}
			}else if(currentPosY < 0){
				pos = 0;
				break;
			}
		}
		
		// 페이지의 끝에 스크롤이 도달했을 경우 pos = 4
		if( ( getWindowHeight()+currentPosY) >= $(document).height()-10 || pos === null){
			pos = 4;
		}
		
		st_menu_link.removeClass('active');
		st_menu_list.eq(pos).children('a').addClass('active');
	}
	
	// 상사 대표 인사말
	var st_store_advertisement = $('.st_store_advertisement, .st_store_advertisement_m');
	var btn_store_advertisement = $('.btn-play-video-ceo, .st_ceo_introduce, .st_ceo_introduce_m');
	var bg_ceo_video = $('.bg_ceo_video');
	var st_video_url = $('.st_video_url').val();
	var ceo_video = '<iframe class="youtube_video" width="900" height="506" src="https://www.youtube.com/embed/'+ st_video_url + '?autohide=0&autoplay=1&modestbranding=1&rel=0&theme=light" frameborder="0" allowfullscreen></iframe>';
	
	btn_store_advertisement.bind('click', function (e) {
		e.preventDefault();
		moveToPosY(0);
		st_store_advertisement.html(ceo_video);
		bg_ceo_video.fadeIn(300);
		st_store_advertisement.fadeIn(300);
		bg_ceo_video.css('height' , cacluateDocumentHeight());
		freezeScroll(true);
	});
	
	
	function cacluateDocumentHeight(){
		return $(Document).height();
	}
	
	var doc = $('html body');
	function freezeScroll(check){
		if(check) {
			doc.css('overflow-y', 'hidden');
		}else{
			doc.css('overflow-y', 'auto');
		}
	}
	
	bg_ceo_video.bind('click', function () {
		freezeScroll(false);
		bg_ceo_video.fadeOut(300);
		st_store_advertisement.fadeOut(300);
		st_store_advertisement.html('');
	});
	
	
	
}); // end of func