const db = require('./connect').connection;
var sql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var util = require('util');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//sql connection
db.connect();
//direct page
app.use(express.static('./')); //前面的參數不設，否則無法加載css，例如設立public,html會在public/main下尋找css檔案，然而其本身就在main
app.use(cookieParser());


//main page
function getProductInfo(callback){
	var name_list = [];
	var price_list = [];
	var image_list = [];
	var id_list = [];

	var j = 0;
	for(var num=1; num<5; num++){
		db.query('SELECT product_name, product_price, \
		product_image_url, product_id FROM products WHERE \
		product_category = '+num+' ORDER BY RAND() LIMIT 4;', function(err, results){
			if(err) throw err;
			else {
				j += 1;
				for(var x=0; x<results.length;x++){
					name_list.push(results[x].product_name);
					price_list.push(results[x].product_price);
					image_list.push(results[x].product_image_url);
					id_list.push(results[x].product_id);
				}
				callback(j, null, [name_list, price_list, image_list, id_list]);
			}
		})
	}
}


/* result is a list, so results[i], and include product_name, product_price, product_image_url, and product_id*/

function callback(loopnum, err, data){
	if(err) throw err;
	else if(loopnum == 4){
		var name_list = data[0];
		var price_list = data[1];
		var image_list = data[2];
		var id_list = data[3];
		app.get('/main.html', function(req, res){
			if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
				login = true
			}else{
				login = false
			}
			res.render(__dirname+ '\\main\\main2.ejs', 
				{ name: name_list, price: price_list, image: image_list, 
					id: id_list, login: login })})
	}
}

//product page
app.get('/test/product_id=:id', function(req, res){
	db.query("SELECT * FROM products WHERE product_id = "+req.params.id+" ; ",
		function(err, results){
			if(err) throw err;
			else{
				var name = results[0].product_name;
				var price = results[0].product_price;
				var image = results[0].product_image_url;
				var id = results[0].product_id;
				res.render(__dirname+'/product/'+'product.ejs', { name: name, price: price, image: image, id: id });
			}
		})
})

app.get('/getCookie', function(req,res){
	res.cookie('cookie',{'name': 'dkfg2012', "login":true, "cart":[10,20,30,6,21,24,12]}, { maxAge: 60000 });
	res.send('set cookie');
})




//login page
function LoginCheck(request, response, username, password){
	db.query("SELECT user_name, user_password FROM users WHERE user_name = '"+username+"' ; ", function(err, results){
		if (err) {console.log('err');}
		else if(password == results[0].user_password){ 
			response.cookie('cookie',{'name': username, "login":true, "cart":[]}, { maxAge: 60000 });
			response.redirect('/main.html');
		 }
	})

}

app.post('/login_check', urlencodedParser, function(req, res){
	if(req.body.pwd_repeat == req.body.password){
		LoginCheck(req, res, req.body.username, req.body.password)
	}else{
		res.send('wrong repeated password');
	}
}
)

app.get('/login.html', function(req, res){
	res.sendFile(__dirname+'/login/'+'login.html');
})

//add to cart

app.get('/add_cart/product_id=:id', function(req, res){
	user_cart = req.cookies.cookie['cart'];
	req.cookies.cookie['cart'].push(req.params.id)
	res.cookie('cookie',{'name': 'dkfg2012', "login":true, "cart":user_cart}, { maxAge: 60000 });
	res.redirect('/main.html');
})

app.get('/user_home.html', function(req, res){
	if(typeof(req.cookies.cookie) == 'undefined'){
		res.redirect('/main.html');
	}
	else{
		var cart_list = req.cookies.cookie['cart'];
		var name_list = [];
		var price_list = [];
		var image_list = [];
		var num = 0;
		for(var i = 0; i<cart_list.length; i++){
			var j = -1;
			var num_loop = req.cookies.cookie['cart'][num];
			db.query("SELECT product_name, product_price, product_image_url FROM products WHERE product_id = "+num_loop+" ;", function(err, results){
				name_list.push(results[0].product_name);
				price_list.push(results[0].product_price);
				image_list.push(results[0].product_image_url);
				j += 1;
				if(j == cart_list.length-1){
					res.render(__dirname+ '\\user\\user_home.ejs', 
						{ name: name_list, price: price_list, image: image_list })
				}
			}
			);
			num += 1;
	}
}
})

app.get('/user/payment', function(req, res){
	var cart = req.cookies.cookie['cart'];
	console.log(cart);
	var j = 0;
	for(var i = 0; i<cart.length; i++){
		db.query('SELECT product_price FROM products WHERE product_id = '+ cart[j] + " ; ", function(err, results){
			if(err) throw err;
			else{
				console.log(results[0].product_price);
			}
		});
	j += 1;}
})


app.set('view engine', 'ejs');

var server = app.listen(8000, function(){
	getProductInfo(callback);
	console.log('working');
})