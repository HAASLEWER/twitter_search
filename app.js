var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan'); 
var fs 	= require("fs");
var path = require('path');
var config = require('./config.js');

var port = config.port;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ensure all json is sanitized flowing through our routes
app.use(require('sanitize').middleware);

// Enable cross origin resource sharing, to avoid those nasty browser errors
app.use(cors());

// Disable loggin while running unit tests
if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('combined'));
}

var apiRoutes = express.Router();

// Define our static assets (js/css)
app.use(express.static('public'))

// Define our default view (index.html)
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Include all our routes from the routes dir
var routePath = "./lib/routes/"; 
fs.readdirSync(routePath).forEach(function(file) {
    // Include routes in sub directories
	if (fs.lstatSync(routePath + file).isDirectory()) {
		fs.readdirSync(routePath + file).forEach(function(dir_file) {
		    var route = routePath + file + "/" + dir_file;
		    require(route)(app);
		});
	} else {
	    var route = routePath + file;
	    require(route)(app);
	}
}); 

app.listen(port);
console.log('Listening on http://localhost:' + port);