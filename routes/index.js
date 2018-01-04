const express = require('express');
const router = express.Router();
// const mysql_dbc = require('../commons/db_conn')();
// const connection = mysql_dbc.init();
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const async = require('async');
const QUERY = require('../database/query');
const JSON = require('JSON');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({extended:false});
const sanitizeHtml = require('sanitize-html');
require('../helpers/helpers');
const isMobile = require('is-mobile');


var httpToHttps = function (req, res, next) {
	var
		isHttps = req.headers['x-forwarded-port'],
		host = req.headers.host,
		url = req.url;
	
	if(express().get('env') !== 'production'){
		next();
	}else{
		if(isHttps === '443'){
			next();
		}else{
			res.redirect(`https://${host}${url}`);
		}
	}
};


//
router.get('/', (req, res) => {

	var task = null;
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('main', {
				title : PROJ_TITLE,
				current_path : 'MAIN'
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});



// 문의하기
router.get('/request', httpToHttps, csrfProtection, (req, res) => {
	res.render('request', {
		title : PROJ_TITLE,
		current_path : 'REQUEST',
		csrfToken : req.csrfToken()
	});
});

// 문의 접수하기
router.post('/request/to/chadaeli', parseForm, csrfProtection, (req, res) => {
	const _info = {
		name : sanitizeHtml(req.body.name.trim()),
		tel : sanitizeHtml(req.body.tel.trim()),
		comment : sanitizeHtml(req.body.comment.trim())
	};
	connection.query(QUERY.REQUEST.InsertReqeust,
		[_info.name, _info.tel, _info.comment],
		(err, rows) => {
			if(err){
				console.error(err);
				throw new Error(err);
			}
			res.redirect('/');
		});
});

// 차주에게 물어보기
router.get('/request/2dealer/:id', httpToHttps, csrfProtection, (req, res) => {
	const item_id = sanitizeHtml(req.params.id.trim());
	
	res.render('request_dealer', {
		title : PROJ_TITLE,
		current_path : 'REQUEST2DEALER',
		csrfToken : req.csrfToken(),
		item_id
	});
});

// 최저가 접수 문의
router.post('/request/to/dealer', parseForm, csrfProtection, (req, res) => {
	const _info = {
		c_name : sanitizeHtml(req.body.name.trim()),
		tel : sanitizeHtml(req.body.tel.trim()),
		item_id : sanitizeHtml(req.body.item_id.trim()),
		comment : sanitizeHtml(req.body.comment.trim())
	};
	
	connection.query(QUERY.REQUEST.InsertReqeustToDealer, _info, (err, rows) => {
			if(err){
				console.error(err);
			}
			res.redirect('/detail/' + _info.item_id);
		});
});


// todo 내차 팔기 폼
router.get('/request/sell', httpToHttps, csrfProtection, (req, res) => {
	res.render('request_sell', {
		title : PROJ_TITLE + ' 내차팔기',
		current_path : 'REQUEST_SELL',
		csrfToken : req.csrfToken()
	});
});

// todo 내차 예약하기 폼
router.get('/request/buy', httpToHttps, csrfProtection, (req, res) => {
	res.render('request_buy', {
		title : PROJ_TITLE + ' 내차예약하기',
		current_path : 'REQUEST_BUY',
		csrfToken : req.csrfToken()
	});
});




/**
 * 개인정보취급방침
 */
router.get('/privacy', (req, res) => {
	res.render('privacy' , {
		title : PROJ_TITLE + ', 개인정보취급방침',
		current_path : 'PRIVATE'
	});
});

router.get('/event', (req, res) => {
	res.render('event' , {
		title : PROJ_TITLE + ', 진행중인 이벤트',
		current_path : 'EVENT'
	});
});

/**
 * 차대리 소개
 */
router.get('/about', (req, res) => {
	res.render('about' , {
		title : PROJ_TITLE + ', 차대리소개',
		current_path : 'ABOUT'
	});
});

/**
 * 특가상품 다 보기
 */
router.get('/special_item', httpToHttps, csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 추천 상품 모두 가져오기
			connection.query(QUERY.CARS.GetSpecialListAll, [0,1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 특가 상품',
				current_path : 'SP_ALL',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 내 생애 첫차
 */
router.get('/event/myfirstcar', httpToHttps, csrfProtection, (req, res) => {
	var task = [
		(cb) => { // 내 첫차 추천
			connection.query(QUERY.CARS.GetMyFirstCar, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 출퇴근용 데일리카',
				current_path : 'FIRSTCAR',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 출퇴근용 데일리카
 */
router.get('/event/dailycar', httpToHttps, csrfProtection, (req, res) => {
	var task = [
		(cb) => { // 데일리카 리스트
			connection.query(QUERY.CARS.GetDailyCar, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 출퇴근용 데일리카',
				current_path : 'DAILYCAR',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 왕년에 잘 나가던 차모음
 */
router.get('/event/oldies-but-gooodies', httpToHttps, csrfProtection, (req, res) => {
	var task = [
		(cb) => { // 데일리카 리스트
			connection.query(QUERY.CARS.GetOldButGoodCar, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];

	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 왕년에 잘 나가던 차',
				current_path : 'OLDBUTGOOD',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});


/**
 * 독일3사 리스트
 */
router.get('/foreign_item/germany', httpToHttps, csrfProtection, (req, res) => {
	var task = [
		(cb) => { // 독일3사 리스트 가져오기
			connection.query(QUERY.CARS.GetForeignCarFromGerman, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];

	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 독일3사',
				current_path : 'GERMANY',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

// 수입차만 가져오기
router.get('/foreign_item', csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 수입상품 1000개 가져오기
			connection.query(QUERY.CARS.GetForeignCar, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 수입 상품',
				current_path : 'FOREIGN',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

// 특수 화물 차 등을 가져온다
router.get('/unusual_item', csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 특수차 1000개 가져오기
			connection.query(QUERY.CARS.GetUnusualCar, [0, 1000], (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 특수 화물 상품',
				current_path : 'UNUSUAL',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 인기상품
 */
router.get('/popular_item', csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 추천 상품 모두 가져오기
			connection.query(QUERY.CARS.GetPopListAll, (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 인기 상품',
				current_path : 'POP_ALL',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 추천 상품
 */
router.get('/recommend_item', csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 추천 상품 모두 가져오기
			connection.query(QUERY.CARS.GetRecomListAll, (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 추천 상품',
				current_path : 'RCM_ALL',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 제휴상품
 */
router.get('/affiliate_item', csrfProtection, (req, res) => {
	
	var task = [
		(cb) => { // 추천 상품 모두 가져오기
			connection.query(QUERY.CARS.GetAffiliateListAll, (err, list) => {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('item_all', {
				title : PROJ_TITLE + ' 차대리 상품',
				current_path : 'AFF_ALL',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});


router.post('/search/item', parseForm, csrfProtection, (req, res) => {
	var _word =  sanitizeHtml(req.body.searchWord.trim());
	
	// todo 스트링으로 검색을 할 경우 문제가 안 생기나?
	// console.log( _word );
	
	if(_word === '' || _word === undefined || _word == null){
		res.redirect('/');
	}else{
		var task = [
			// 총 보유 상품
			(cb) => {
				connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			}
			// 실보유 상품 및 최근 일주일간 등록한 상품
			,(cb) => {
				connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			},
			(cb) => { // 특가
				connection.query(QUERY.CARS.GetSearchResultSP, [_word, _word], (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			},
			(cb) => { // 특가 외 상품
				connection.query(QUERY.CARS.GetSearchResultNotSP, [_word, _word], (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			}
		];
		
		async.parallel( task, (err, result) => {
			if(!err){
				// 검색어를 수집할 것
				connection.query(QUERY.DATAS.InsertSearchWord, [_word], (err, result) => {
					if(err){
						console.error(err);
					}
				});
				
				res.render('search_result', {
					title : PROJ_TITLE + ' 검색결과 ' + _word,
					current_path : 'SRC_ALL',
					word : _word,
					csrfToken : req.csrfToken(),
					total_item : result[0],
					own_item : result[1],
					sp_list : result[2],
					list : result[3]
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		});
	}
});


/**
 * 매거진 전체 보기
 */
router.get('/magazine', csrfProtection, (req, res) => {
	const task = [
		(cb) => {
			connection.query(QUERY.MAGAZINE.GetList, [0, 1000], (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 총 보유 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('magazine_all', {
				title : PROJ_TITLE + ' 매거진',
				current_path : 'MAGAZINE',
				csrfToken : req.csrfToken(),
				list: result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 검색화면 전홤
 */
router.get('/search', csrfProtection, (req, res) => {
	
	// 상품 갯수에 대한 정보를 뿌려줄 수 있도록 한다.
	
	const task = [
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel( task, (err, result) => {
		if(!err){
			res.render('search', {
				title : PROJ_TITLE,
				current_path : 'SEARCH',
				csrfToken : req.csrfToken(),
				total_item : result[0],
				own_item : result[1]
			});
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
	
});

/**
 * 이벤트 기획 페이지 SUV 관련
 */
router.get('/event/suv', csrfProtection, (req, res) => {
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventSUV, [0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_suv', {
				title : PROJ_TITLE + ' 기획상품, 여행을 위한 패밀리카',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 이벤트 기획 상품 경차 관련
 */
router.get('/event/smallcar', csrfProtection, (req, res) => {
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventSmallCar, [0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_small', {
				title : PROJ_TITLE + ' 기획상품, 경차',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 이벤트 기획 동급 대비 짧은 주행 거리
 */
router.get('/event/short_distance', csrfProtection, (req, res) => {
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventSuperShort, [0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_short', {
				title : PROJ_TITLE + ' 기획상품, 동급대비 주행거리 갑!',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
	/*connection.query(QUERY.EVENT.EventSuperShort, [0, 1000], (err, result) => {
		if(!err){
			res.render('event/event_short', {
				title : PROJ_TITLE + ' 기획상품, 동급대비 주행거리 갑!',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});*/
	
	
});

/**
 * 신차급
 */
router.get('/event/new', csrfProtection, (req, res) => {
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventNewCar, [0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];

	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_new', {
				title : PROJ_TITLE + ' 기획상품, 신차급',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 500만원대 상품
 */
router.get('/event/car/500', csrfProtection, (req, res) => {
	
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventPriceList, [0, 500, 0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_price_500', {
				title : PROJ_TITLE + ' 기획상품, 500만원대',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 1000만원대 상품
 */
router.get('/event/car/1000', csrfProtection, (req, res) => {
	
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventPriceList, [500, 1000, 0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_price_1000', {
				title : PROJ_TITLE + ' 기획상품, 1000~500만원대',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 금액대별 상품 보기
 */
router.get('/event/price/:first/:end', csrfProtection, (req, res) => {
	const first = sanitizeHtml(req.params.first.trim());
	const end = sanitizeHtml(req.params.end.trim());
	
	console.log(`${first} ~ ${end}`);
	
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventPriceList, [first, end, 0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_price', {
				title : PROJ_TITLE + ' 가격대별 상품 모음',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2],
				first,
				end
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});

/**
 * 5천만원대 이상 상품
 */
router.get('/event/price/5000', csrfProtection, (req, res) => {
	const first = null;
	const end = null;
	const task = [
		(cb) => {
			connection.query(QUERY.EVENT.EventPriceList, [5000, 900000, 0, 1000], (err, result) => {
				if(!err){
					cb(null, result);
				}else{
					console.error(err);
					cb(err, null);
				}
			});
		},
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('event/event_price', {
				title : PROJ_TITLE + ' 가격대별 상품 모음',
				current_path : 'EVENT',
				csrfToken : req.csrfToken(),
				list : result[0],
				total_item : result[1],
				own_item : result[2],
				first,
				end
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
	
});


/**
 * todo 개선할 것.
 * @param data
 * @returns {Array}
 */
function aggregateNotNullImage(data){
	var
		_arr = [],
		_d = data[0];
	
	if(_d.img_1){
		_arr.push(_d.img_1);
	}
	if(_d.img_2){
		_arr.push(_d.img_2);
	}
	if(_d.img_3){
		_arr.push(_d.img_3);
	}
	if(_d.img_4){
		_arr.push(_d.img_4);
	}
	if(_d.img_5){
		_arr.push(_d.img_5);
	}
	if(_d.img_6){
		_arr.push(_d.img_6);
	}
	if(_d.img_7){
		_arr.push(_d.img_7);
	}
	if(_d.img_8){
		_arr.push(_d.img_8);
	}
	if(_d.img_9){
		_arr.push(_d.img_9);
	}
	if(_d.img_10){
		_arr.push(_d.img_10);
	}
	if(_d.img_11){
		_arr.push(_d.img_11);
	}
	if(_d.img_12){
		_arr.push(_d.img_12);
	}
	if(_d.img_13){
		_arr.push(_d.img_13);
	}
	if(_d.img_14){
		_arr.push(_d.img_14);
	}
	if(_d.img_15){
		_arr.push(_d.img_15);
	}
	if(_d.img_16){
		_arr.push(_d.img_16);
	}
	if(_d.img_17){
		_arr.push(_d.img_17);
	}
	if(_d.img_18){
		_arr.push(_d.img_18);
	}
	if(_d.img_19){
		_arr.push(_d.img_19);
	}
	if(_d.img_20){
		_arr.push(_d.img_20);
	}
	
	return _arr;
}

/**
 * 상품 상세 페이지
 */
router.get('/detail/:id', csrfProtection, (req, res) => {
	const _id = sanitizeHtml(req.params.id.trim());
	
	if(_id){
		const task = [
			(cb) => {
				connection.query(QUERY.CARS.GetDetailInfoById, [_id], (err, rows) => {
					if(err){
						cb(err, null);
						console.error(err);
					}else{
						cb(null, rows);
					}
				});
			},
			(cb) => {
				connection.query(QUERY.CARS.GetItemImagesById, [_id], (err, rows) => {
					if(err){
						cb(err, null);
						console.error(err);
					}else{
						cb(null, rows);
					}
				});
			}
			// 총 보유 상품
			,(cb) => {
				connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			}
			// 실보유 상품 및 최근 일주일간 등록한 상품
			,(cb) => {
				connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
					if(!err){
						cb(null, cars);
					}else{
						cb(err, null);
					}
				});
			}
		];
		
		async.parallel( task, (err, result) => {
			// console.info(result);
			if(!err){
				
				console.info(result[1]);
				
				var images = null;
				if(result[1].length > 0 ){
					images = aggregateNotNullImage(result[1]);
				}
				
				// console.info(images);
				// console.info(result[1]);
				
				res.render('sub_detail', {
					title : PROJ_TITLE + ' 상품 상세',
					current_path : 'SUBDETAIL',
					csrfToken : req.csrfToken(),
					info : result[0],
					images,
					total_item : result[2],
					own_item : result[3]
				});
			}else{
				console.error(err);
				res.redirect('/');
			}
		});
	}else{
		res.redirect('/');
	}
});


/**
 * 제휴페이지
 */
router.get('/partnership', csrfProtection, (req, res) => {
	const task = [
		// 총 보유 상품
		(cb) => {
			connection.query(QUERY.DATAS.GetTotalCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
		// 실보유 상품 및 최근 일주일간 등록한 상품
		,(cb) => {
			connection.query(QUERY.DATAS.GetTotalWithWeekCount, (err, cars) => {
				if(!err){
					cb(null, cars);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('partnership', {
				title : PROJ_TITLE + ' 파트너십',
				current_path : 'PARTNERTSHIP',
				csrfToken : req.csrfToken(),
				total_item : result[0],
				own_item : result[1]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
});


/**
 * 여기서부터 특별제휴상사 관련 페이지
 */


/**
 * 성원자동차 상사 페이지
 */
router.get('/store/:eng_name', (req, res) => {
	const eng_name = sanitizeHtml( req.params.eng_name.trim() );
	
	const task = [
		(cb) => {
			connection.query(QUERY.STORE.sungwonItemSoldCount, (err, data) => {
				if(!err){
					cb(null, data);
				}else{
					cb(err, null);
				}
			});
		},
		(cb) => {
			connection.query(QUERY.STORE.sungwonItem, [0, 1000], function (err, list) {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		},
		(cb) => {
			connection.query(QUERY.STORE.GetVideoUrlByStoreName, [eng_name], function (err, list) {
				if(!err){
					cb(null, list);
				}else{
					cb(err, null);
				}
			});
		}
	];
	
	async.parallel(task, (err, result) => {
		if(!err){
			res.render('store/sungwon/index' , {
				title : PROJ_TITLE + ', 성원자동차',
				current_path : 'MICROSTORE',
				list : result[1],
				size : result[1].length,
				soldCount : result[0],
				video_url : result[2]
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
});

module.exports = router;