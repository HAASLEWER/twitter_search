// Search Model
var config = require('../../config.js');
var JsonDB = require('node-json-db');
var Validator = require('jsonschema').Validator;
var v = new Validator();

// Save a tweet to the json db
exports.save = function(app, req, cb) {	
	var tweet = req.body.tweet;

	// Validate the fields submitted
	var schema = {
		"id": "tweet_schema",
		"type": "object",
		"properties": {
			"user": {
				"profile_image_url": {"type": "string", "minLength": 1},
				"name": {"type": "string", "minLength": 1}
			},
			"text": {"type": "string", "minLength": 1}
		},
		"required": ["user", "text"]
	};

	var validator = v.validate(tweet, schema);

	if (validator.errors.length > 0) {
		cb(validator.errors, null);
	} else {
		var db = new JsonDB(config.db, true, false);
		db.push("/" + tweet.id, tweet);

		cb(null, 200, tweet);
	}
}

// Get all saved tweets
exports.getAll = function(app, req, cb) {	
	try {
		var db = new JsonDB(config.db, true, false);
		var data = db.getData("/");

		cb(null, 200, data);
	} catch(e) {
		cb(e, null);
	}
}

// Delete a saved tweet by id
exports.delete = function(app, req, cb) {	
	try {
		var id = req.params.id;
		var db = new JsonDB(config.db, true, false);
		db.delete("/" + id);

		cb(null, 200, "success");
	} catch(e) {
		cb(e, null);
	}
}