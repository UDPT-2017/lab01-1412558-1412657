// app/routes.js
var nodemailer=require('nodemailer');
var transporter = nodemailer.createTransport('smtp://kool.milk.tea%40gmail.com:Thienduongvangem@smtp.gmail.com');







const pg = require('pg')
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'lab01', //env var: PGDATABASE
  password: 'Kuga1996', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	var bcrypt = require('bcrypt-nodejs');
	app.get('/', function(req, res) {
		
		//console.log(bcrypt.hashSync(123456, null, null)); 
		res.render('index.ejs', {
			user : req.user // get the user out of session and pass to template
		}); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', isLogged, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});




	// FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { 
	  	successRedirect: '/',
	    failureRedirect: '/login' 
	}));

	//console.log("đnag ở đaysdfghjkl;'kljhgfdfjk");










	app.get("/", function (req,res){
	//console.log(__dirname);
	res.render("index.ejs");
});


app.get("/blog", function (req,res){
	pool.connect(function(err, client, done) {
	  	if(err) {
	    	return console.error('error fetching client from pool', err);
	  	}
	  
	  	// select blog
	  	client.query('SELECT * FROM "Blog"', function(err, result) {
		done(err);
	    if(err) {
	    	res.end();
	      	return console.error('error running query', err);
	    }
	    res.render("blog.ejs", {blog_list:result});
	  	}); // end client
	}); // end pool
}); // end app


app.get("/blog/:id", function (req,res){	
	var id=req.params.id;
	pool.connect(function(err, client, done) {
	  	if(err) {
	    return console.error('error fetching client from pool', err);
	  	}

	  	// select blog 
	  	client.query('UPDATE "Blog" SET view=view+1 where id='+id, function(err, ro ){
		    if(err) {
		    	res.end();
		      	return console.error('error running query', err);
	   		}
	   			// update view
	   			client.query('SELECT * FROM "Blog" where id = '+ id, function(err, result) 
	   			 {
	   				if(err) {
			    		res.end();
			      		return console.error('error running query', err);
			   		}

				 		// select comment of blog
				   		client.query('SELECT * FROM "Comment" where blog ='+id, function(err, rb) {
						    if(err) {
						    	res.end();
						      	return console.error('error running query', err);
						    }

						    res.render("blogdetail.ejs", {
						    	blog : result.rows[0], 
						    	comment_list : rb,
						    	user: user
						    });
						    }); //end client  
			   		}); //end client
			}); //end client
	    }); //end pool
}); //end app



app.get("/about", function (req,res){
	res.render("about.ejs");
});

app.get("/albums", function (req,res){
	res.render("albums.ejs");
});
};


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	// "/" => trang chủ
	res.redirect('/');
}
//
function isLogged(req, res, next) {

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

////////////////////////////////SEND MAIL /////////////////////////////


 //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  					// FACEBOOK LOGIN //
   //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    /*
 module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
   

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};
*/