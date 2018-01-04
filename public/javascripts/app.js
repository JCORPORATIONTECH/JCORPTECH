/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
  map: {},
  paths: {
		jquery: ['/components/jquery/dist/jquery.min'],
		vue: ['/components/vue/dist/vue'],
		lodash : ['/components/lodash/dist/lodash'],
		swiper : ['/javascripts/vendor/swiper.jquery.min'],
		countUp : ['/components/countUp.js/dist/countUp.min'],
		slick : ['/components/slick-carousel/slick/slick.min']
  },
  shim: {
		swiper : ['jquery'],
		slick : ['jquery']
  }
});
