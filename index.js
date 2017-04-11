var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views", "./views");
app.listen(8888);

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


app.get("/", function (req,res){
	//console.log(__dirname);
	res.render("main");
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

						    res.render("blogdetail.ejs", {blog : result.rows[0], comment_list : rb});
						    }); //end client  
			   		}); //end client
			}); //end client
	    }); //end pool
}); //end app



app.get("/about", function (req,res){
	res.render("about.ejs");
});

app.get("/albums", function (req,res){
	console.log("sadfghjk")
	res.render("albums.ejs");
});

app.get("/albums/abc", function (req,res){
	res.render("albums.ejs");
});

