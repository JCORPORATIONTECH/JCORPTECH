const QUERY = {};

QUERY.REQUEST = {
	InsertReqeust :
		'insert into `request` (`name`, `tel`, `comment`) values(?,?,?);',
	//CollectLog : 'insert into `log_request` (`os_type`, `ip_address`) values (?,?);',
	//CheckIpDuplicated : 'select count(*) from `log_request` where `ip_address`=?;'
	InsertReqeustToDealer :
			`
			insert into ask_question_dealer set ?;
			`
};

QUERY.VIDEO = {
	GetVideoList :
		`
		select * from main_videos where active=true order by priority desc;
		`,
	GetVideoListForPc :
		`
		select * from main_videos
		where active=1
		order by priority desc
		limit 0, 3;
		`
};

QUERY.CARS = {
	GetSpecialList :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='SP' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 10;
		`,
	GetSpecialListByCount :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='SP' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit ?, ?;
		`,
	GetRecomList :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='R' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 10;
		`,
	GetForeignCar :
		`
		select *
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		left join company as c
		on c.id = cs.company_id
		where c.type='F' and cs.active=true and sc.active=true and cs.sold=0
		order by cs.created_dt desc
		limit ?,?;
		`,
	GetForeignCarFromGerman :
		`
		select *, cs.id as sid
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		left join company as c
		on c.id = cs.company_id
		where (c.name='벤츠' or c.name='메르세데스' or c.name='BMW' or c.name='아우디') and cs.sold=false and cs.active=true and sc.active=true
		order by cs.created_dt desc, cs.id desc
		limit ?,?;
		`,
	GetDailyCar :
		`
		select *, cs.id as sid
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		left join company as c
		on cs.company_id = c.id
		where c.type='D'and cs.sold=false and cs.active=true and (cs.type_id='X101' or cs.type_id='S202' or cs.type_id='M404') and (cs.price <= 1000)
		and cs.sold=false and cs.active=true and sc.active=true
		order by cs.created_dt desc, cs.id desc
		limit ?,?;
		`,
	GetMyFirstCar :
		`
		select *, cs.id as sid
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		left join company as c
		on cs.company_id = c.id
		where c.type='D'and cs.sold=false and cs.active=true and (cs.type_id='X101' or cs.type_id='S202') and (cs.price <= 800)
		and cs.sold=false and cs.active=true and sc.active=true
		order by cs.created_dt desc, cs.id desc
		limit ?,?;
		`,
	GetUnusualCar :
		`
		select *
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		where cs.active=true and (cs.type_id='B900' or cs.type_id='XL90' or cs.type_id='ETC10') and cs.sold=0
		order by created_dt desc
		limit ?, ?;
		`,
	GetRCMListByCount :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='R' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit ?, ?;
		`,
	GetPopList :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='P' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 10;
		`,
	GetPOPListByCount :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='P' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit ?, ?;
		`,
	GetAffiliateList :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.cafe_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='A' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 10;
		`,
	GetAffiliateListByCount :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.cafe_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='A' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit ?, ?;
		`,
	GetSpecialListAll :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='SP' and sc.active=1 and c.active=1 and c.sold=0
		order by c.created_dt desc, c.id desc
		limit ?, ?;
		`,
	GetRecomListAll :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='R' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 1000;
		`,
	GetPopListAll :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		where sc.type='P' and sc.active=1 and c.active=1
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 1000;
		`,
	GetAffiliateListAll :
		`
		select
		sc.id as sid, sc.s_price, sc.hits, sc.priority, sc.due_dt, sc.registered_dt,
		c.id as car_id, c.model, c.img_url, c.price, c.year, c.kilo, c.fuel, c.badge, c.active, c.sold, c.init_dt, c.blog_url, c.cafe_url, c.video_url, c.option_id
		from special_car as sc
		inner join cars as c
		on sc.car_id = c.id
		left join company as cp
		on cp.id = c.company_id
		where sc.type='A' and sc.active=1 and c.active=1 and cp.type='D' and sold=false
		order by sc.priority desc, sc.registered_dt desc
		limit 0, 1000;
		`,
	GetSearchResultList :
		`
		select
		c.*,
		sc.type, sc.s_price, sc.priority, sc.due_dt, sc.active as s_active
		from cars as c
		inner join company as cp
		on cp.id = c.company_id
		left join special_car as sc
		on sc.car_id = c.id
		where (c.model like "%"?"%" or cp.name like "%"?"%") and (sc.active is null or sc.active=true)
		order by sc.type desc, c.id desc;
		`,
	GetSearchResultSP :
		`
		select
		c.*,
		sc.type, sc.s_price, sc.priority, sc.due_dt, sc.active as s_active
		from cars as c
		inner join company as cp
		on cp.id = c.company_id
		left join special_car as sc
		on sc.car_id = c.id
		where (c.model like "%"?"%" or cp.name like "%"?"%") and sc.type = 'SP' and c.active=true and c.sold=0
		order by c.created_dt desc, c.id desc;
		`,
	GetSearchResultNotSP :
		`
		select
		c.*,
		sc.type, sc.s_price, sc.priority, sc.due_dt, sc.active as s_active
		from cars as c
		inner join company as cp
		on cp.id = c.company_id
		left join special_car as sc
		on sc.car_id = c.id
		where (c.model like "%"?"%" or cp.name like "%"?"%") and (sc.type != 'SP') and c.active=true and c.sold=0
		order by c.created_dt desc, c.id desc;
		`,
	GetDetailInfoById :
		`
		select
		cs.*,
		a.video_url as admin_video, a.img_url as admin_img, a.store_id, st.store_name, a.admin_id as ceo_tel, a.name as ceo_name, st.level, st.province, st.region, st.eng_name,
		c.name as company,
		co.navigation, co.blackbox, co.sunroof, co.hipass, co.rear_camera, co.smartkey, co.leather_seat, co.heat_seat, co.cool_seat, co.memory_seat
		,p.*
		from cars as cs
		left join admin as a
		on a.id = cs.owner
		left join store as st
		on st.id = a.store_id
		left join company as c
		on c.id = cs.company_id
		left join car_option as co
		on co.id = cs.option_id
		left join performance as p
		on p.p_id = cs.performance_id
		where cs.id=?;
		`,
	GetItemImagesById :
		`
		select * from item_imgs where item_id=?;
		`,
	GetOldButGoodCar :
		`
		select *, cs.id as sid
		from cars as cs
		left join special_car as sc
		on cs.id = sc.car_id
		left join company as c
		on cs.company_id = c.id
		where (cs.year <= 2010 and cs.sold=false and cs.active=true and cs.price <= 1000 and cs.sold=false and cs.active=true and sc.active=true) and (((cs.type_id='L505' or cs.type_id='U707' or cs.type_id='M404') and c.type='F') or (((cs.type_id='L505' or cs.type_id='U707') and c.type='D')))
		order by c.type desc, cs.price asc, cs.created_dt desc, cs.id desc
		limit ?,?;		
		`
};

QUERY.DATAS = {
	GetWeekItemCount :
		`
		select count(*) as week_count from cars
		where created_dt BETWEEN DATE_ADD(NOW(), INTERVAL-1 WEEK ) AND NOW();
		`,
	GetTotalWithWeekCount :
		`
		select count(*) as item_count from cars
		where created_dt BETWEEN DATE_ADD(NOW(), INTERVAL-1 WEEK ) AND NOW()
		union
		select count(*) as item_count from cars
		`,
	GetTotalCount :
		`
		select own_count from total_item_history
		order by id desc, created_dt desc
		limit 1;
		`,
	InsertSearchWord :
		`
		insert into searchword (word) values (?);
		`,
	GetGoodStore : // 임시로 우수 상사를 소개하는 리스트를 아래의 로직으로 가져온다.
		`
		select * from store 
		where active=1 and thumbnail is not null
		order by id asc
		limit ?,?;
		`
};

QUERY.MAGAZINE = {
	LIST :
		`
		select * from magazine
		where active=true
		order by priority desc
		limit 0, 5;
		`,
	GetListAll :
		`
		select * from magazine
		where active=true
		order by priority desc
		limit 0, 1000;
		`,
	GetList :
		`
		select * from magazine
		where active=true
		order by created_dt desc, priority desc
		limit ?, ?;
		`,
	GetMagazineTargeted :
		`
		select * from magazine
		where m_type='T10' and title like '%TV%'
		order by created_dt desc
		limit ?, ?;
		`
};


QUERY.EVENT = {
	EventSUV :
		`
		select 
		cs.id, cs.model, cs.img_url, cs.price, cs.year, cs.kilo, cs.video_url, cs.fuel, cs.blog_url, cs.cafe_url,
		cs.type_id, cs.sold, cs.option_id, s.type as sp_type
		from cars as cs
		inner join special_car as s
		on s.car_id = cs.id
		where cs.type_id = 'U707' and cs.active=true and cs.sold=0
		order by cs.year desc, cs.kilo desc, cs.id desc
		limit ?,?;
		`,
	EventSmallCar :
		`
		select 
		cs.id, cs.model, cs.img_url, cs.price, cs.year, cs.kilo, cs.video_url, cs.fuel, cs.blog_url, cs.cafe_url,
		cs.type_id, cs.sold, cs.option_id, s.type as sp_type
		from cars as cs
		inner join special_car as s
		on s.car_id = cs.id
		where cs.type_id = 'X101' and cs.active=true and cs.sold=0
		order by cs.year desc, cs.kilo desc, cs.id desc
		limit ?,?;
		`,
	EventSuperShort :
		`
		select 
		cs.id, cs.model, cs.img_url, cs.price, cs.year, cs.kilo, cs.video_url, cs.fuel, cs.blog_url, cs.cafe_url,
		cs.type_id, cs.sold, cs.option_id, s.type as sp_type
		from cars as cs
		inner join special_car as s
		on s.car_id = cs.id
		where cs.active=true and (((year(curdate())-cs.year)*15000) > cs.kilo) and cs.sold=0
		order by cs.year desc, cs.price asc, cs.kilo asc, cs.id desc
		limit ?,?
		`,
	EventNewCar :
		`
		select 
		cs.id, cs.model, cs.img_url, cs.price, cs.year, cs.kilo, cs.video_url, cs.fuel, cs.blog_url, cs.cafe_url,
		cs.type_id, cs.sold, cs.option_id, s.type as sp_type, s.s_price
		from cars as cs
		inner join special_car as s
		on s.car_id = cs.id
		where cs.active=true and cs.sold=0
		and (year(curdate())-2) <= cs.year and cs.kilo <= 20000
		order by cs.year desc, cs.kilo asc, cs.id desc
		limit ?,?;
		`,
	EventPriceList :
		`
		select 
		cs.id, cs.model, cs.img_url, cs.price, cs.year, cs.kilo, cs.video_url, cs.fuel, cs.blog_url, cs.cafe_url,
		cs.type_id, cs.sold, cs.option_id, s.type as sp_type, s.s_price
		from cars as cs
		inner join special_car as s
		on s.car_id = cs.id
		where cs.active=true and cs.sold=0
		and cs.price >= ? and cs.price <= ?
		order by cs.year desc, cs.kilo asc, cs.id desc
		limit ?,?;
		`
};

// 기존 쿼리에서 차대리 인증 상품의 경우, special_car에서 금액을 가져오는데 이걸 없애야 한다.
QUERY.STORE = {
	sungwonItem :
		`
		select * from cars as cs
		inner join special_car as sc
		on sc.id = cs.id
		where cs.active=1 and cs.sold=0 and cs.owner=3
		order by cs.id desc
		limit ?,?;
		`,
	sungwonItemSoldCount :
		`
		select count(*) as soldCount from cars as cs
		inner join special_car as sc
		on sc.id = cs.id
		where cs.sold=1 and cs.owner=3
		order by cs.id desc;
		`,
	GetVideoUrlByStoreName :
		`
		select video_id from store where eng_name=?;
		`
};


QUERY.LIVETHECAR = {
	list :
		`
		select * from partner_livethecar
		where active=1
		order by id desc, promoted_dt desc
		limit ?, ?;
		`
};

QUERY.COUNT = {
	accumulatePrice :
	`
	select sum(price) as total from cars where sold=1;
	`,
	soldCount :
	`
	select count(*) as count from cars where sold=1;
	`
}


module.exports = QUERY;