const formidable = require('formidable');
const md5 = require('md5');
const async = require('async');
const AWS = require('aws-sdk');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// AWS.config.region = 'ap-northeast-2';
const s3 = new S3Instance();
const Upload = {};
const fs = require('fs');
// AWS.config({
// 	signatureVersion: 'v4'
// });

function S3Instance() {
	'use strict';
	let instance;
	// S3Instance = function () {
	// 	return instance;
	// };
	if(!instance){
		instance = new AWS.S3({ signatureVersion: 'v4' });
	}
	
	return instance;
}

/**
 * REAL ROOT_PATH 는 ${process.cwd()}/HC2.0-Project-Admin/ 을 사용해야한다
 * // TODO 한번에 로컬 데브 리얼 동시에 사용할수 있게 수정  or npm 스크립트에서 선택적으로 실행 가능하게 변경할것
 */
const ROOT_PATH = process.cwd();
console.log(`ROOT_PATH : ${ROOT_PATH}`);

//const ROOT_PATH = `${process.cwd()}/HC2.0-Project-Admin/`;


/*S3 버킷 설정*/
let params = {
	Bucket: 'chadaeli',
	Key: null,
	ACL: 'public-read',
	Body: null
};

Upload.S3KYES = {
	CARS : 'cars/',
	TEST : 'test/'
	// CALENDAR: 'broadcast/calendar/',
	// EVENT_RESULT: 'event/result/',
	// EVENT: 'event/',
	// CHANNEL: 'channel/',
	// NEWS: 'news/'
};

function FormidableInstance() {
	'use strict';
	let instance;
	
	if(!instance){
		instance = new formidable.IncomingForm({
			encoding: 'utf-8',
			multiples: true,
			keepExtensions: false, //확장자 제거
			uploadDir: `${ROOT_PATH}/public/temp/` // todo 현재 디랙토리를 기준으로 파일을 임시로 업로드 하게 되어 있는데 이게 리얼에 가서도 동일하게 작동하는지 여부를 판단해야 한다.
		}); // todo 만약 temp 파일이 없어서 업로드가 실패할 경우 폴더를 생성해주어야 한다.
	}
	
	return instance;
}

Upload.formidable = (req, callback) => {
	let _fields;
	
	const form = new FormidableInstance();
	
	form.parse(req, function (err, fields) {
		_fields = fields;
	});
	
	// Form File의 Name 값으로 S3_FILE_NAME 값을 결정하다.
	form.on('file', (name, file) => {
		file.S3_FILE_NAME = name;
	});
	
	// form.on('progress', (bytesReceived, bytesExpected) => {
	//   let percent = (bytesReceived / bytesExpected * 100) | 0;
	//   // console.log(percent);
	// });
	
	form.on('error', function (err) {
		callback(err, null, null);
	});
	
	form.on('end', function () {
		callback(null, this.openedFiles, _fields);
	});
};

Upload.optimize = (files, callback) => {
	// TODO 이미지 파일만 최적화를 사용할 수 있도록 한다
	// TODO 최적화가 완료되면 S3 업로드를 진행한다
	
	async.each(files, (file, cb) => {
		console.log(file.path);
		
		imagemin([file.path], `${ROOT_PATH}/public/temp/`, {
			plugins: [
				// imageminMozjpeg(),
				imageminPngquant({quality: '0-80', verbose: true, floyd: 1})
			]
		}).then((test) => {
			console.log('Optimizing images');
			console.log(test);
			console.log('Finishing optimizing');
			cb();
		});
	}, (err) => {
		callback(err);
	});
};

// todo 각 메서드에 대한 유닛 테스트가 없어서 시일이 지난 후에 다시 점검을 하는 경우 아주 큰 기술부채가 발생하게 된다...
Upload.s3 = (files, key, callback) => {
	
	console.log(files[0].name);
	console.log(files[0].path);
	
	const s3_file_name = makeS3FilesName(files[0].name);
	console.info('uploading file name : ' + s3_file_name);
	
	params.Key = key + s3_file_name; // key is path
	params.Body = require('fs').createReadStream(files[0].path);
	
	s3.upload(params, (err, result) => {
		if(err){
			console.error(err);
			callback(err, null);
		}else{
			result.S3_FILE_NAME = s3_file_name; // 생성된 파일을 이름을 콜백으로 전달하기 전에 오버라이드한다.
			callback(null, result);
		}
	});
};

Upload.s3Multiple = (files, key, callback) => {
	async.each(files, (file, cb) => {
		params.Key = key + file.S3_FILE_NAME;
		params.Body = require('fs').createReadStream(file.path);
		
		s3.upload(params, (err, result) => {
			cb(err, result);
		});
	}, (err, result) => {
		callback(err, result);
	});
};

// AWS 업로드, 디비 저장이 완료되면 해당 파일을 삭제시킨다.
Upload.RemovieFile = (callback) => {
	const path = `${ROOT_PATH}/public/temp/`;
	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file) {
			var curPath = path + '/' + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				Upload.RemovieFile(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
	}
};

function makeS3FilesName(file_name) {
	return (md5(file_name + new Date()));
}


module.exports = Upload;