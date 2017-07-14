// Search Routes
var Search = require('../models/search');

module.exports = function(app) {
	// Search for twitter hashtags
	app.post('/search',function(req, res) {
		Search.search(app, req, function(err, code, result) {
			if (err) { 
		      return res.status(code || 400).send({ 
		          err 
		      });
			}

			return res.send({result: result});
		});		
	});
}