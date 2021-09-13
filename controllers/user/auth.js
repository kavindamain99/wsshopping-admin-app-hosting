const User = require('../../models/user/user');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const {errorHandler} = require('../../helpers/user/dbErrorHandler')


exports.user_signin = (req, res) => {

    // find user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please Signup"
            });
        }
        // if user is found, make sure the email and password match
        // create authenticate methode in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match"
            })
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        // presist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999});
        // retun response with user and token to frontend client
        const {_id, firstname, lastname, email, phoneno, addressl1, addressl2, city, postalcode, role} = user
        return res.json({token, user: {_id, email, firstname, lastname, phoneno, addressl1, addressl2, city, postalcode, role }});

    });

};

exports.user_signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout Success!"});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],        //RS256 changed to HS256                       // added later
    userProperty: "auth",
  });

  // fix(auth and admin middlewares)
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
        if(!user) {
            return res.status(403).json({
                error: "Access Denied"
            });
        }
    next();    
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resources! Access denied"
        });
    }
    next();
};

