'use strict';

requirejs(
	['jquery'],
  function ($) {
		
		var submitBtn = $('.btn-submit');
		var _form = {
			form : $('#form_request'),
			name : $('#customer_name'),
			tel : $('#customer_tel'),
			memo : $('#commentTextarea')
		};
		
		submitBtn.bind('click', function (e) {
			e.preventDefault();
			
			if(_form.name.val() === ''){
				alert('고객님의 성명을 입력해주세요.');
				_form.name.focus();
				return;
			}
			
			if(_form.tel.val() === ''){
				alert('고객님의 전화번호를 입력해주세요.');
				_form.tel.focus();
				return;
			}
			
			if(
				!checkDigitSize(_form.tel.val()) ||
				!checkDigit(_form.tel.val()))
			{
				alert('전화번호를 다시 확인해주세요.');
				_form.tel.focus();
				return;
			}
			
			_form.form.submit();
		}); // click event handler
		
		_form.name.bind('keydown', preventEnterEvt);
		_form.tel.bind('keydown', preventEnterEvt);
		
		
		function preventEnterEvt(evt){
			if(evt.keyCode === 13){
				evt.preventDefault();
			}
		}
		
		function checkDigit(tel){
			var _tel = tel.toString();
			_tel.substring(1, _tel.length);
			return /^[0-9]*$/.test(_tel);
		}
		
		function checkDigitSize(num){
			var size = num.length;
			if(size >=10 && size <=12){
				return true;
			}
			return false;
		}
	
		// video
		// var
		// 	video = $('.video'),
		// 	height = $('.img_preview').height(),
		// 	_data = JSON.parse($('.video_list_val').val());
		//
		// new Vue({
		// 	delimiters : ['{', '}'],
		// 	el : '#list-video',
		// 	data : {
		// 		video_list : _data
		// 	},
		// 	methods : {
		// 		selectVideo : function(evt, data){
		// 			$('.link_video').removeClass('active');
		// 			$('.list_wrap').removeClass('active');
		// 			$(event.target).parent().parent().addClass('active');
		// 			$(event.target).parent().addClass('active');
		//
		//
		// 			video.html('<iframe src="https://www.youtube.com/embed/'+data+'?autoplay=1&rel=0&showinfo=1&controls=1" width="100%" height="'+height+'" frameborder="0" />');
		//
		// 			return false;
		// 		}
		// 	}
		// });
		//
		// $('.video_link').bind('click', function () {
		// 	alert('[차대리] 아래 리스트중 보고 싶은 영상을 선택하세요^^');
		// 	return false;
		// });
	
	  /**
	   * @param arr -> data
	   * @param findStr -> search word
	   * @returns {Array}
	   */
  // function searchArrayWithWord(arr, findStr){
		// var
		// newList = [],
		// size = arr.length;
  //
		// for(var i=0;i<size;i++){
		// 	if(arr[i].model.indexOf(findStr) != -1){
		// 		console.log('found');
		// 		newList.push(arr[i]);
		// 	}else{
		// 		console.log('not found');
		// 	}
		// }
  //
		// return newList;
  // }


  // var sp_list_data = JSON.parse($('.sp_list_data').val());
  //
  //
  // new Vue({
		// delimiters : ['{', '}'],
		// el: '#sp_list',
		// data: {
		// 	searchWord : '',
		// 	special_list : sp_list_data,
		// 	imageUrl : $('#static-url').val(),
		// 	empty : false
		// },
		// methods : {
		// 	searchItem : function (e) {
		// 		var word = e.target.value.trim();
		// 		//console.log( e.target.value );
		//
		// 		var result = searchArrayWithWord(sp_list_data, word);
		//
		// 		this.special_list = result;
		//
		// 		if(result.length > 0){
		// 			this.empty = false;
		// 		}else{
		// 			this.empty = true;
		// 		}
		//
		// 		// 아래와 같이 하면 새로운 데이터를 바인딩할 수 있다.
		// 		// this.special_list = [{"model" : "test"}];
		//
		// 	//	console.log('search!!');
		// 	},
		// 	makeImg :  function (data) {
		// 		return this.imageUrl + 'cars/' + data.img_url;
		// 	},
		//
		// 	makeUrl : function (data){
		// 		return 'http://blog.naver.com/chadaeli/' + data;
		// 	}
		//
		// }
  // });
	
	// inputSearch.on('keyup', _.debounce(function () {
	// 	console.log( inputSearch.val() );
	// 	console.log('key');
	// }, 1000));
 
	
	  
	// from here, new mobile
		
  // var btnVideoCF = $('.btn-video-trigger');
  // var videoCon = $('.m_video');
  // btnVideoCF.bind('click', function () {
	 //  var _video = '<iframe width="100%" height="170" src="https://www.youtube.com/embed/WHOM0APgUbo?autoplay=0&rel=0&showinfo=1&controls=1&autohide=1&theme=light&disablekb=1&modestbranding=1" frameborder="0" allowfullscreen></iframe>';
		// videoCon.html(_video);
		// return false;
  // });

  var btnSearchOpen = $('.btn-search');
  // var frm_search = $('.frm_search');
  // var inputSearch = $('.input-search');
  //
	 
  btnSearchOpen.bind('click', function () {
	  // frm_search.removeClass('blind');
	  // inputSearch.focus();
	  // alert('click');
	
	  naviContoller(true);
	  return false;
  });
	
  var _naviInHd = $('.m_header .navi');
  
  /**
   * 헤더에 있는 네비 노출 컨트롤
   * @param check
   * @constructor
   */
  function naviContoller(check){
		if(check){
			_naviInHd.css('display', 'block');
		}else{
			_naviInHd.css('display', 'none');
		}
  }
	 
  var doc = $(document);
	/**
	* 페이지의 Y위치를 파악하여 리턴한다.
	* @returns {number}
	*/
	function checkPageScroll(){
		return doc.scrollTop();
	}

	$(window).scroll(function () {
		var posY = checkPageScroll();
		if(posY >= 141){
			$('.m_header .navi').css('display', 'block');
		}else{
			$('.m_header .navi').css('display', 'none');
		}
		// $('.txt-dev').html(posY);
	});

	
	// 아이콘 노출 관련
  var btnChatAndMail = $('.btnChatAndMail');
	var btnChannelIcon = $('.btnChannelIcon');
	var ico_sns = $('.ico_sns');
	var ico_request = $('.ico_request');
	
	
  btnChannelIcon.bind('click', function (e) {
		e.preventDefault();
		ico_request.addClass('blind');
		if(ico_sns.hasClass('blind')){
			ico_sns.removeClass('blind');
		}else{
			ico_sns.addClass('blind');
		}
  });
	
  btnChatAndMail.bind('click', function (e) {
		e.preventDefault();
		ico_sns.addClass('blind');
		if(ico_request.hasClass('blind')){
			ico_request.removeClass('blind');
		}else{
			ico_request.addClass('blind');
		}
	});
	
  var leftNavi = $('.btn-menu,.btn-menu-2');
  var m_container = $('.m_container');
  var left_navi = $('.left_navi');
  var closeNavi = $('.closeNavi');
  
  leftNavi.bind('click', function (e) {
		e.preventDefault();
		left_navi.removeClass('blind');
		m_container.addClass('blind');
		$(document).scrollTop(0);
  });
	
	closeNavi.bind('click', function (e) {
		e.preventDefault();
		left_navi.addClass('blind');
		m_container.removeClass('blind');
	});
	
	
	var searchBtn = $('.btn-search');
  searchBtn.bind('click', function () {
		window.location.href='/search';
	});


  // 메인 금액대별
	var list_500 = $('.list500');
  var list_1000 = $('.list1000');
  var link_500 = $('.btn-500-list');
  var link_1000 = $('.btn-1000-list');


  link_500.bind('click', function (e) {
		e.preventDefault();
		list_500.removeClass('blind');
		list_1000.addClass('blind');
		link_500.addClass('active');
		link_1000.removeClass('active');
  });

  link_1000.bind('click', function (e) {
		e.preventDefault();
		list_1000.removeClass('blind');
		list_500.addClass('blind');
		link_500.removeClass('active');
		link_1000.addClass('active');
  });


	
	
}); // end of func