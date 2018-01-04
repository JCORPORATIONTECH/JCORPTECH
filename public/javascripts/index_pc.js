'use strict';

requirejs(
	['jquery'], function ($) {
	
	// PC
	var
		video_link = $('.video-link'),
		iframe_video = $('.iframe_video'),
		vTitle = $('.video-title');
	
	video_link.bind('click', function () {
		var
			
			_title = $(this).attr('data-video-title'),
			_vid = $(this).attr('data-video-id'),
			_common_param = '?autoplay=0&rel=0&showinfo=1&controls=1&autohide=1&theme=light&disablekb=1&modestbranding=1';
		
		video_link.removeClass('active');
		$(this).addClass('active');
		
		vTitle.html(_title);
		iframe_video.attr('src', 'https://www.youtube.com/embed/' + _vid + _common_param);
	});
		
}); // end of func


