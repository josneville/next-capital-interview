var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({secret: 'next capital is dope'}));

app.use(express.static(__dirname + "/public"));

app.get('/todos', function(req, res) {
	res.sendFile(path.join(__dirname, './public', 'index.html'));
});

require('./app/routes/index')(app);

app.listen(process.env.PORT || 5000); //Run the server on port 5000
console.log("Server now running on port 5000");
