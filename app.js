const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use('/public', express.static('main'));
app.get('/login.html', (req, res)=>{
	res.sendFile(path.join(__dirname + "/login/login.html"));
})	

app.post('/login_check', (req, res)=>{
	res.send(req.body);
	// var response = {
	// 	"Username": req.body.username,
	// 	"Password": req.body.password
	// };
	// res.end(JSON.stringify(response)); //JSON.stringify convert JS value to JSON String 
})

var server = app.listen(8000, ()=>{
	var host = server.address().address;
	var port = server.address().port;

	console.log('visting %s:%s', host, port);
})