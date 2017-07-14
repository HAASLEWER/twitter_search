// DB Routes
var DB = require('../models/db');

module.exports = function(app) {
	// Save a tweet to the json db
	app.post('/save',function(req, res) {
		DB.save(app, req, function(err, code, result) {
			if (err) { 
		      return res.status(code || 400).send({ 
		          err 
		      });
			}

			return res.send({result: result});
		});		
	});	

	// Get saved tweets
	app.get('/save',function(req, res) {
		DB.getAll(app, req, function(err, code, result) {
			if (err) { 
		      return res.status(code || 400).send({ 
		          err 
		      });
			}

			return res.send({result: result});
		});		
	});	

	// Delete a saved tweet by id
	app.delete('/delete/:id',function(req, res) {
		DB.delete(app, req, function(err, code, result) {
			if (err) { 
		      return res.status(code || 400).send({ 
		          err 
		      });
			}

			return res.send({result: result});
		});		
	});		
}