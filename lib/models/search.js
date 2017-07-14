// Search Model
var config = require('../../config.js');
var JsonDB = require('node-json-db');
var Twit = require('twit');
var T = new Twit({
  consumer_key:         config.consumer_key,
  consumer_secret:      config.consumer_secret,
  access_token:         config.access_token,
  access_token_secret:  config.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

// Search for all tweets with the provided hashtag
exports.search = function(app, req, cb) {		
	var hashtag = req.body.hashtag;

	T.get('search/tweets', { q: hashtag + ' since:2011-07-11', count: 100 }, function(err, data, response) {
		// Return the result
		cb(null, 200, data);
	});
}