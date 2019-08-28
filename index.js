const db = require('./connect').connection;
var sql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var util = require('util');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var sendMail = require('./mail.js')
var formidable = require('formidable');
var fs = require('fs');
var url = require('url')


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
			// if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
			// 	login = true
			// }else{
			// 	login = false
			// }
			// if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['merchant'] == true ){
			// 	merchant = true
			// }else{
			// 	merchant = false
			// }
			var login = CookieCheck(req)[0];
			var merchant = CookieCheck(req)[1];
			res.render(__dirname+ '\\main\\main2.ejs', 
				{ name: name_list, price: price_list, image: image_list, 
					id: id_list, login: login, merchant: merchant})})
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
				var category = results[0].product_category;
				var comments = []
				// if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
				// 	login = true
				// }else{
				// 	login = false
				// }
				var login = CookieCheck(req)[0];
				db.query('SELECT comment_content FROM comments WHERE comment_post_id = '+req.params.id+" ; ", function(err, results){
					try{
						for(let i = 0; i<results.length;i++){
							comments.push(results[i].comment_content)
						}
					}catch(err){}
					db.query('SELECT MAX(product_id) FROM products', function(err, results){
						var max = results[0]
						var max = max[Object.keys(max)[0]]
						res.render(__dirname+'/product/'+'product.ejs', { name: name, price: price, image: image, id: id , category:category, login: login, comments:comments, max:max});
					})
				})
			}
		})
})

app.get('/getCookie', function(req,res){
	res.cookie('cookie',{'name': 'dkfg2012', "login":true, "cart":[10,20,30,6,21,24,12], 'merchant':1}, { maxAge: 600000 });
	res.send('set cookie');
})



//INSERT INTO comments (comment_content, comment_post_id) VALUES ('hello world', 2);
//add comment
app.get('/post_comment/product_id=:id&comment=:cd', function(req, res){
	db.query('INSERT INTO comments (comment_content, comment_post_id) VALUES ("'+req.params.cd+'" , '+req.params.id+");", function(err, results){
		if(err) throw err;
		else{
			res.redirect('../test/product_id='+req.params.id);
		}})
	}
)




//login page
app.get('/login.html', function(req, res){
	res.sendFile(__dirname+'/login/'+'login.html');
})

//logout page
app.get('/logout.html', function(req, res){
	res.cookie('cookie',{'name': 'dkfg2012', "login":true, "cart":[], 'merchant':req.cookies.cookie['merchant']}, { maxAge: -60000 });
	res.redirect('/main.html')

})

//registration page
app.get('/registration.html', function(req, res){
	res.sendFile(__dirname+'/login/'+'registration.html');
})


app.post('/reg_check', urlencodedParser, function(req, res){
	var code = Math.floor((Math.random() *100000) + 100000)
	var content = "Your passing code is "+ code +", enter the code shortly for the registration"
	var mailer = new sendMail('no reply email', content, req.body.email)
	var username = req.body.username
	var password = req.body.password
	var email = req.body.email
	var merchant = req.body.merchant
	db.query('SELECT * FROM users WHERE user_name = "'+ username+'" ; ', function(err, results){
		if(results.length == 0){
			res.send('2')
			console.log(code)
			app.get('/sendCode=:code', function(req, res){
				if(code == req.params.code){
					var money = 10000
					db.query('INSERT INTO users (user_name, user_password, user_email, user_money, Merchant) VALUES ( "'+username+'" , "'+password+'" , "'+email+'" , '+money+' , '+merchant+' ); ',
						function(err,results){
							res.redirect('/login.html')
						}
					 )
				}else{
					res.send("<p>wrong passing code, please restart the registration</p><a href='/registration.html'>Return</a>")
				}
			})
		}else{
			res.send('1');
		}
	})
})


//Function loginCheck
function LoginCheck(req, res, username, password){
		db.query("SELECT user_name, user_password, Merchant FROM users WHERE user_name = '"+username+"' ; ", function(err, results){
			if (typeof results[0] == 'undefined'){ 
				res.send('<h1>No such User</h1><a href="/login.html">Return</a>')
				res.end();
		}
			else if(password == results[0].user_password){ 
				var merchant = results[0].Merchant;
				var merchant = parseInt(merchant.toString('hex'), 16)
				res.cookie('cookie',{'name': username, "login":true, "cart":[], "merchant": merchant}, { maxAge: 600000 });
				res.redirect('/main.html');
		 	}
		 	else{
		 		res.send('<h1>Wrong Password</h1><a href="/login.html">Return</a>')
		 		res.end();
		 	}
		})
}

//Function CookieCheck
function CookieCheck(req){
	if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
		login = true
	}else{
		login = false
	}
	if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['merchant'] == true ){
		merchant = true
	}else{
		merchant = false
	}
	return [login, merchant]
}



//login check
app.post('/login_check', urlencodedParser, function(req, res){
	if(req.body.pwd_repeat == req.body.password){
		LoginCheck(req, res, req.body.username, req.body.password)
	}else{
		res.send('<p>wrong repeated password</p><a href="/login.html">Return</a>');
		res.end();
	}
}
)




//cart page
app.get('/add_cart/product_id=:id&num=:num', function(req, res){
	user_cart = req.cookies.cookie['cart'];
	for(let i = 0; i<req.params.num; i++){
		req.cookies.cookie['cart'].push(parseInt(req.params.id))
	}
	res.cookie('cookie',{'name': req.cookies.cookie['name'], "login":true, "cart":user_cart, 'merchant':req.cookies.cookie['merchant']}, { maxAge: 600000 });
	res.redirect('/test/product_id='+req.params.id);
})




//clear cart
app.get('/clear_cart', function(req, res){
	var user_cart = req.cookies.cookie['cart']
	var length = req.cookies.cookie['cart'].length
	for(let i=0; i<length; i++){
		user_cart.pop()
	}
	res.cookie('cookie',{'name': req.cookies.cookie['name'], "login":true, "cart":user_cart, 'merchant':req.cookies.cookie['merchant']}, { maxAge: 600000 });
	res.send(req.cookies);

})



//remove one item
app.get('/remove_item=:order', function(req, res){
	var index = req.params.order;
	var user_cart = req.cookies.cookie['cart'];
	user_cart.splice(index, 1);
	res.cookie('cookie',{'name': req.cookies.cookie['name'], "login":true, "cart":user_cart, 'merchant':req.cookies.cookie['merchant']}, { maxAge: 600000 });
	res.send(req.cookies);

})


//category page
app.get('/category=:id', function(req, res){
	var name_list = [];
	var price_list = [];
	var image_list = [];
	var id_list = [];
	// if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
	// 			login = true
	// 		}else{
	// 			login = false
	// 		}
	var login = CookieCheck(req)[0];
	db.query('SELECT * FROM products WHERE product_category = '+req.params.id+" ; ", function(err, results){
		for(let i = 0; i<results.length; i++){
			name_list.push(results[i].product_name)
			price_list.push(results[i].product_price)
			image_list.push(results[i].product_image_url)
			id_list.push(results[i].product_id)
			if(i == results.length-1){
				res.render(__dirname+ '\\category\\category.ejs', 
				{ name: name_list, price: price_list, image: image_list, 
					id: id_list, login: login })
			}
		}
	})
})



//merchant home
app.get('/merchant_home.html', function(req, res){
	var name_list = [];
	var price_list = [];
	var image_list = [];
	var id_list = [];
	// if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['login'] == true ){
	// 			login = true
	// 		}else{
	// 			login = false
	// 		}
	var login = CookieCheck(req)[0];
	var merchant = CookieCheck(req)[1];
	if(merchant == true){
		db.query("SELECT * FROM products WHERE merchant = '"+req.cookies.cookie['name']+"' ; ", function(err, results){
			if(results.length == 0){
				res.render(__dirname+ '\\merchant\\user_home.ejs', 
					{ name: name_list, price: price_list, image: image_list, 
						id: id_list, login: login , merchant: req.cookies.cookie['merchant']})
					}else{
						for(let i = 0; i<results.length; i++){
							name_list.push(results[i].product_name)
							price_list.push(results[i].product_price)
							image_list.push(results[i].product_image_url)
							id_list.push(results[i].product_id)
							if(i == results.length-1){
								res.render(__dirname+ '\\merchant\\user_home.ejs', 
								{ name: name_list, price: price_list, image: image_list, 
									id: id_list, login: login , merchant: req.cookies.cookie['merchant']})
							}
						}
					}
		})	
		}else{
			res.redirect('/main.html')
		}
	})
// 	if(typeof(req.cookies.cookie) != 'undefined' && req.cookies.cookie['merchant'] == true ){
// })



//user home
app.get('/user_home.html', function(req, res){
	if(typeof(req.cookies.cookie) == 'undefined'){
		res.redirect('/main.html');
	}
	else{
		if(req.cookies.cookie['cart'].length == 0){
			var name = null;
			res.render(__dirname+'\\user\\user_home.ejs', {name: name})
		}else{
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
}
})




//buy product
app.get('/buy_product/product_id=:id&num=:num', function(req, res){
	db.query("SELECT product_price FROM products WHERE product_id = "+req.params.id+" ; ", function(err, results){
		var price = parseInt(results[0].product_price)*parseInt(req.params.num)
		db.query("SELECT user_money, user_email FROM users WHERE user_name = '"+req.cookies.cookie['name']+"' ; ", function(err, results){
						var money_left = parseFloat(results[0].user_money) - price;
						if(money_left < 0){
							res.send('1')
						}else{
							var reciever = results[0].user_email;
							db.query("UPDATE users SET user_money = "+money_left+" WHERE user_name = '"+req.cookies.cookie['name']+"' ; ", function(err, results){
									var content = "You have just bought " + req.params.num + " items, and the total price is "+ price +" HKD. Your account remain "+money_left+" HKD."
									var mailer = new sendMail('no reply email', content, reciever)
									res.redirect('../test/product_id='+req.params.id);
								})
						}
					})
	})
})






//payment
app.get('/user/payment', function(req, res){
	var cart = req.cookies.cookie['cart'];
	// var a = '['+cart+']'
	var username = req.cookies.cookie['name']
	var total_price = 0;
	for(let i = 0; i<cart.length; i++){
		db.query('SELECT product_price FROM products WHERE product_id = '+ cart[i] + " ; ", function(err, results){
			if(err) throw err;
			else{
				total_price += parseFloat(results[0].product_price)
				if(i == cart.length-1){
					//INSERT INTO recieve_order (buyer_name, recieved_orders, merchant) VALUES ("dkfg2012", "[1,2,3]", "dkfg2012")
					db.query("INSERT INTO recieve_order (buyer_name, recieved_orders, merchant) VALUES ('"+username+"' , '"+cart+"', 'dkfg2012');", function(err, results){
						if(err){throw err}
					})
					db.query("SELECT user_money, user_email FROM users WHERE user_name = '"+username+"' ; ", function(err, results){
						var money_left = parseFloat(results[0].user_money) - total_price;
						var reciever = results[0].user_email;
						if(money_left < 0){
							res.send('1')
							
						}else{
							db.query("UPDATE users SET user_money = "+money_left+" WHERE user_name = '"+username+"' ; ", function(err, results){
								var content = "You have just bought " + cart.length + " items, and the total price is "+ total_price +" HKD. Your account remain "+money_left+" HKD."
								var mailer = new sendMail('no reply email', content, reciever)
								res.cookie('cookie',{'name': username, "login":true, "cart":[], 'merchant':req.cookies.cookie['merchant']}, { maxAge: 600000 });
								res.send(req.cookies);
							})
						}
					})
				}
			}

		});
	}
})





//add_new_item
app.get('/merchant_home/add_new_product', function(req, res){
	if(CookieCheck(req)[0] == true && CookieCheck(req)[1] == true){
		res.render(__dirname+ '\\merchant\\add_new_item.ejs' )
	}else{
		res.redirect('/main.html')
	}
})



//?name=:name&price=:price&product_des=:product_des&storage=:storage
app.post('/add_item', function(req, res){
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files){
    	var name = fields.name;
    	var price = fields.price;
    	var des = fields.product_des;
    	var storage = fields.storage;
    	var oldpath = files.filetoupload.path;
    	var category = fields.Category
        var newpath = 'C:/Users/WingHo/Desktop/eshop/photo/' + files.filetoupload.name;
        var photopath = "photo\\\\"+files.filetoupload.name;
        db.query(" INSERT INTO products (product_name, product_price, product_stocks, product_image_url, product_slug, product_category, merchant)\
        	VALUES ('"+name+"' , '"+price+"' , '"+storage+"' , '"+photopath+"' , '"+name+"' ,'"+ category + "' , '"+req.cookies.cookie['name']+"' );",
        	function(err, results){
        		if(err) throw err;
		        fs.rename(oldpath, newpath, function (err) {
		        	if (err) throw err;
		        	res.redirect('/merchant_home.html');
        	})
    })
})
})


app.get('/merchant_home/orders', function(req, res){
	if(CookieCheck(req)[0] == true && CookieCheck(req)[1] == true){
		var merchant = req.cookies.cookie['name'];
		db.query("SELECT recieved_orders FROM recieve_order WHERE merchant = '"+merchant+"' ;", function(err, results){
			if(results.length != 0){
				var order = results[0].recieved_orders
				var order = order.split(',')
				for(let i = 0; i<order.length; i++){
					console.log(order[i])
				}
			}else{
				console.log('no order yet')
			}
		})
	}
})

//edit product
app.get('/merchant_home/edit_product_id=:id', function(req, res){
	var id = req.params.id;
	if(CookieCheck(req)[0] == true && CookieCheck(req)[1] == true){
		res.render(__dirname+ '\\merchant\\edit_item.ejs' )
		app.post('/edit_item', function(req, res){
			var form = new formidable.IncomingForm();
		    form.parse(req, function (err, fields, files){
		    	var name = fields.name;
		    	var price = fields.price;
		    	var des = fields.product_des;
		    	var storage = fields.storage;
		    	var category = fields.Category
		        db.query(" UPDATE products SET product_name = '"+name+"',\
		         product_price = '"+price+"', \
		         product_stocks = '"+storage+"', \
		         product_slug = '"+name+"', \
		         product_category = '"+category+"' WHERE product_id = "+ id +" ;",
		        	function(err, results){
		        		if(err) throw err;
				        res.redirect('/merchant_home.html');
		    })
		})
		})
	}else{
		res.redirect('/main.html')
	}
})





app.set('view engine', 'ejs');

var server = app.listen(8000, function(){
	getProductInfo(callback);
	console.log('working');
})