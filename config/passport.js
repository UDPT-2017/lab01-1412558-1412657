// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model

var bcrypt = require('bcrypt-nodejs');
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
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //console.log(email);
            pool.query('SELECT * FROM "Users" WHERE email = ($1)',[email], function(err, rows) {
                if (err)
                    return done(err);
                //console.log(rows.rows[0].email);
                console.log(rows.rows.length);
                if (rows.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUser = {
                        fullname:'1',
                        email:'1',
                        phone:'1',
                        pwuser: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        avatar: '1'
                    };

                    // insert user in database
                    pool.query('INSERT INTO "Users" ("fullname", "phone", "email", "avatar", "pwuser") VALUES ($1,$2,$3,$4,$5)',
                        [newUser.fullname, newUser.phone, newUser.email, newUser.avatar, newUser.pwuser], function (err, rows){
                        if (err)
                            return done(err);
                        if (rows.length) {
                           // return done(null, false, req.flash('signupMessage', 'SignUp Successfully.'));
                            newUser.id = rows.insertId;
                            return done(null, newUser);
                        }
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    //log in với thông tin từ databasse của mình
    // mình lấy thông tin đó, sau đó mình kiểm tra.
    passport.use(
        'local-login',
        new LocalStrategy({
            //input type =text name="username" thì mặc định nó sẽ lấy username và passworrd
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            //query raw
            //nó ko hỗ trợ mình một giao thức tính năng gì đó giúp query
            //query builderr laravel đi.
            //thay vì query select * from userr
            //DB::table('User')->get();
            // một dấu nháy vs 2 dấu nháy đều hiểu là bên trong là chuỗi
            //nhưng mà nó giúp mình có thể biết và setup được
            //var user = "'user'" //console => 'user'

            //var user = '"Users"'; //=> "user"
                pool.query('SELECT * FROM  "Users" WHERE email = ($1)',[email], function(err, rows){
                if (err)
                    return done(err);
                //object
                //object length == 1
                //kiểm tra tồn tại userr
                // Obj chứa Nhiều Obj => chứa nhiều thông tin
                //console.log(rows.rows[0].email);
                //console.log(rows.rows.length);
                if (!rows.rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                //userr tồn tại.
                console.log("đang ở đây");
                // if the user is found but the password is wrong

                if (!bcrypt.compareSync(password, rows.rows[0].pwuser))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows.rows[0]);
            });
        })
    );
};
