var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

/* GET requests to render pages */
router.get('/register', function(req, res, next) {
    res.render('registerEMP');
});

/* POST requests for registration and login */ 
router.post('/registerEMP', function(req, res, next){
    var username = req.body.user_name;
    var password = req.body.password;
    var email = req.body.email;
    // Check if account already exists
    Employee.findOne({ 'user_name' :  username }, function(err, user) {
        // 3. Check if there is an error
        if (err)
            res.send(err);

        // 4. Check to see if theres already a user with that email
        if (employee) {
            res.status(401).json({
                "status": "info",
                "body": "Username already taken"
            });
        } else { // 5. If there is no user with that username create the user
            var newEMP = new Employee();

            // 6. Set the user's local credentials
            newEMP.user_name = username;
            newEMP.password = newUser.generateHash(password);
            newEMP.email = email;
            
            // 7. Create a JWT for the user based on username (function is in this file at bottom)
            // newUser.access_token = createJwt({user_name:username});

            // 8. Save the user details in the database
            newEMP.save(function(err, employee) {
                // 9. If there is an error in doing this, stop and throw an error
                if (err)
                    throw err;

                // 10. Send back a cookie with the access token to the user
                employee.access_token = createJwt({user_id:user._id});
                res.cookie('Authorization', 'Bearer ' + employee.access_token); 

                // 11. Inform the browser that the user has successully signed up
                res.json({'success' : employee.access_token});
            });
        }
    });
});
/*
router.post('/loginEMP', function(req, res, next){
    var username = req.body.user_name;
    var password = req.body.password;

    // 3. Check if the username exists in the database
    User.findOne({'user_name': username}, function (err, user) {
        // 4. If there are any errors, return the error
        if (err)
            res.send(err);
        // 5. If user account found then check the password
        if (user) {
          // Compare passwords
            if (user.validPassword(password)) {
                // 6. Success : Assign new access token for the session
                user.access_token = createJwt({user_id: user._id});
                user.save();

                // 10. Send back a cookie with the access token to the user
                res.cookie('Authorization', 'Bearer ' + user.access_token); 

                // 11. Inform the browser that the user has successully signed up
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
*/
/* GET request to return profile of user currently logged in */ 
router.get('/currentUser', function(req, res, next) {
    try {
        var jwtString = req.cookies.Authorization.split(" ");
        var profile = verifyJwt(jwtString[1]);
        if (profile) {
            res.json({"userid":profile});
        }
    } catch (err) {
        console.log(err);
            res.json({
                "status": "error",
                "body": [
                    "You are not logged in."
                ]
            });
        }
});

function createJwt(profile) {
    return jwt.sign(profile, 'CSIsTheWorst', {
        expiresIn: '2d'
    });
}

function verifyJwt(jwtString) {
    var value = jwt.verify(jwtString, 'CSIsTheWorst');
    return value;
}

module.exports = router;