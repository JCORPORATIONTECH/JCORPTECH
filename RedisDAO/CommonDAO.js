/**
 * Created by yijaejun on 15/12/2016.
 */
var CommonDAO = {};

CommonDAO.QueryDataByKeyName = function (reqCache, key, callback) {
  return reqCache.get(key, callback);
};

CommonDAO.CacheWithKeyName = function (reqCache, key, value, callback) {
  return reqCache.set(key, value, callback);
};

CommonDAO.DeleteByKeyName = function (reqCache, key, callback) {
  return reqCache.del(key, callback);
};

CommonDAO.GetKeysWithPattern = function (reqCache, key, callback) {
  return reqCache.keys(key, callback);
};

CommonDAO.DeleteByKeyPattern = function (reqCache, key, callback) {
  reqCache.keys(key, function (err, keyList) {
    return reqCache.del(keyList, callback)
  });
};


module.exports = CommonDAO;