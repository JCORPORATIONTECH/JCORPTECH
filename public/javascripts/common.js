/**
 * Created by yijaejun on 14/12/2016.
 */

'use strict';

define(
    [
        'jquery'
    ], function ($) {
        
        // 네비게이션 관련 전체 공통 로직
        // console.log('common js');
        
        // 로직 설명
        /**
         * todo
         * 현재 브라우저 사이즈를 체크하여 좌측 네비게이션이 노출되는지 여부를 체크한다.
         * 네비가 켜져 있을 경우 좌상단 버튼을 누르면, 닫혀진다
         * 네비가 닫혀 있을 경우 좌상단 버튼을 누르면 열린다
         * 이 때 화면 사이즈가 일정 비율 이하일 경우 드롭다운으로 보여주고,
         * 일정비율 이상일 경우 좌측에서 있는 네비를 노출시킨다.
         *
         * 1. 전체 브라우저가 1450 이하일 경우, 상단에 기본 메뉴가 노출된다
         * 2. 1450이상일 경우 좌측 메뉴가 자동으로 노출된다.
         *
         */
        
        
        var utils = utils || {};
        utils.isMobile = function () {
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            }
            else {
                return false;
            }
        };
        
        
        return {
            utils: utils
        };
    });