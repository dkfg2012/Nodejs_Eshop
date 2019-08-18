var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'admin',
	password : 'Fjst+197*',
	database : 'eshop'
});
exports.connection = connection;
