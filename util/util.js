var dateFormat = require('dateformat');
var util = {};


util.objEmptyCheck = function (obj) {
  if(obj === null){
    return false;
  }
  //for (var key in obj) {
  //  if (obj[key].length === 0) {
  //    return false;
  //  }
  //}
  return true;
};

/*Credit / Debit 계산*/
util.creditResult = function (currentBalance, amount) {
  return (creditSum(Number(currentBalance), Number(amount)));
};

util.debitResult = function (currentBalance, amount) {
  return (debitSum(Number(currentBalance), Number(amount)));
};

function creditSum(currentBalance, amount) {

  var newBalance = Number(currentBalance + amount);

  if (newBalance < 0) {
    return false;
  } else {
    return newBalance;
  }
}

function debitSum(currentBalance, amount) {

  var newBalance = Number(currentBalance - amount);

  if (newBalance < 0) {
    return false;
  } else {
    return newBalance;
  }
}


util.GetCurrentDateTime = function (letter) {
  if (!letter) {
    letter = ':';
  }
  return dateFormat(new Date(), "yyyy" + letter + "mm" + letter + "dd");
};


util.GetPastDate = function (letter, past) {
  if (!letter) {
    letter = ':';
  }

  if(isNaN(past)){
    throw new Error('[typeError] Please make sure past parameter type');
  }

  var _currentTime = new Date();
  _currentTime.setDate(_currentTime.getDate() - parseInt(past));
  return dateFormat(_currentTime, "yyyy" + letter + "mm" + letter + "dd");
};

/**
 * 임시로 이곳에 저장한 이유는 루프를 돌면서 불필요하게 되는 요소를 제거하기 위함이다. 이를 위해서는 재귀호출로 변경을 해야 한다.
 *
 * 에이전트를 출력하지 좋게 정렬하는 방법
 * @param list : Layer 내림차순으로 정렬된 에이전트 리스트 정보
 * @param count : 요청한 에이전트의 레이어
 * @param host : 요청한 에이전트 코드
 * @returns {Array} : 정렬한 에이전트 리스트 정보를 리턴한다.
 * @constructor
 */
util.RearrangeAgentList = function (list, count, host) {
  var tmp = list, ret = [], tag = [], tmp_tag = [];
  tag.push(host);
  for (var l = parseInt(count) + 1, len = 3; l <= len; l++) {
    for (var i = 0, len2 = tmp.length; i < len2; i++) {
      for (var j = 0, len3 = tag.length; j < len3; j++) {
        if (l === tmp[i].layer && tmp[i].parent_id === tag[j]) {
          if (tag.length > 1) {
            for (var n = 0, len4 = ret.length; n < len4; n++) {
              if (ret[n].code === tmp[i].parent_id) {
                ret.splice(n + 1, 0, {
                  code: tmp[i].code,
                  layer: tmp[i].layer,
                  balance: tmp[i].balance,
                  parent_id: tmp[i].parent_id,
                  suspend: tmp[i].suspend,
                  player_count: tmp[i].player_count
                });
              }
            }
          } else {
            ret.push({
              code: tmp[i].code,
              layer: tmp[i].layer,
              balance: tmp[i].balance,
              parent_id: tmp[i].parent_id,
              suspend: tmp[i].suspend,
              player_count: tmp[i].player_count
            });
          }
          tmp_tag.push(tmp[i].code);
        }
      }
    }
    tag = tmp_tag;
  }
  return ret;
};

/**
 * 오브젝트를 반환된 데이터를 에이전트 코드만 배열에 추출하여 리턴한다.
 * @param list
 * @returns {Array}
 * @constructor
 */
util.SubstractAgentList = function (list) {
  var
    tmp = [],
    len = list.length;

  if (len >= 1) {
    for (var i = 0; i < len; i++) {
      tmp.push(list[i].code);
    }
    return tmp;
  }
  return tmp;
};


util.checkExcessedNumber = function (inserted, max){
  if(parseInt(inserted) > parseInt(max)){
    return true;
  }
  return false;
};


util.removeFrontZeroNumber = function (str) {
  if(typeof str !== 'string'){
    str = str.toString();
  }

  var _str = str.split('');
  var _len = _str.length;
  //console.log('total : ' + _len);

  for(var i=0;i<_len;i++){
    if(_str[i] === '0'){
      _str.splice(0, 1);
    }else if(_str[i] !== '0'){
      // console.log('break : ' + i);
      break;
    }
  }

  return parseInt(_str.join(''));
};


util.removeCommasFromNumber = function (str) {
  if(typeof str !== 'string'){
    str = str.toString();
  }

  while (str.indexOf(",") !== -1) {
    str = (str + "").replace(',', '');
  }

  return parseInt(str);
};




/**
 *TWOACE Game 데이터를 받아와서 `user_game_history` 테이블 포맷에맞게 변경작업을 진행함
 * @param gameDate TWOACE 게임데이터
 */

util.switchToUserGameHistoryFormat = function (gameDate) {

  var gamdateToJson = JSON.stringify(gameDate.rows);

  gamdateToJson = gamdateToJson.replace(/(itemAmount)|(userId)|(:)/g, '');
  gamdateToJson = gamdateToJson.replace(/(totalFee)/g,  ',');
  gamdateToJson = gamdateToJson.replace(/(",")/g,  '"'+gameDate.day+'"'+',');
  gamdateToJson = gamdateToJson.replace(/({)/g, '[');
  gamdateToJson = gamdateToJson.replace(/(})/g, ']');
  gamdateToJson = gamdateToJson.replace(/("")/g, '');

  return JSON.parse(gamdateToJson);

};

module.exports = util;

