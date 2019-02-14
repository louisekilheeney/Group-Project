var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');

router.get('/register', function(req, res, next) {
    res.render('register');
});
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/forgotpass', function(req, res, next) {
    res.render('forgotpass');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next){
    var username = req.body.user_name;
    var password = req.body.password;
    var email = req.body.email;
    // Check if account already exists
    User.findOne({ 'user_name' :  username }, function(err, user)
    {
        if (err)
            res.send(err);
        // check to see if theres already a user with that email
        if (user) {
            res.status(401).json({
                "status": "info",
                "body": "Username already taken"
            });
        } else {
            // If there is no user with that username create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.user_name = username;
            newUser.password = newUser.generateHash(password);
            newUser.email = email;
            newUser.access_token = createJwt({user_name:username});
            newUser.save(function(err, user) {
                if (err)
                    throw err;
	     res.cookie('Authorization', 'Bearer ' + user.access_token); 
                res.json({'success' : 'account created'});

            });
        }
    });
});

router.post('/login', function(req, res, next){
    var username = req.body.user_name;
    var password = req.body.password;
    User.findOne({'user_name': username}, function (err, user) {
        // if there are any errors, return the error
        if (err)
            res.send(err);
        // If user account found then check the password
        if (user) {
          // Compare passwords
            if (user.validPassword(password)) {
                // Success : Assign new access token for the session
                user.access_token = createJwt({user_name: username});
                user.save();
                res.cookie('Authorization', 'Bearer ' + user.access_token); 
                res.json({'success' : 'loggedIn'});
            }
            else {
                res.status(401).send({
                    "status": "error",
                    "body": "Email or password does not match"
                });
            }
        }
        else
        {
            res.status(401).send({
                "status": "error",
                "body": "Username not found"
            });
        } }); });





function createJwt(profile) {
    return jwt.sign(profile, 'CSIsTheWorst', {
        expiresIn: '2d'
    });
}


module.exports = router;
