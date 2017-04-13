// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8888;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database
app.use(express.static("public"));
require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'kuga',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

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
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/img');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('avatar');







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
						    	comment_list : rb
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


/*
                    upload(req, res, function (err) {
                        if (err) {
                          // An error occurred when uploading
                          return
                        }

                        // Everything went fine
                        })
*/