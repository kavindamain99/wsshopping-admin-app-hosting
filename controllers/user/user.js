const user = require("../../models/user/user");
const User = require("../../models/user/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User Not Found"
            });
        }
        req.profile = user;
        next();
    });
};


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { firstname, lastname, email, phoneno, addressl1, addressl2, city, postalcode, password } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!firstname) {
            return res.status(400).json({
                error: 'First Name is required'
            });
        } else {
            user.firstname = firstname;
        }

        if (!lastname) {
            return res.status(400).json({
                error: 'Last Name is required'
            });
        } else {
            user.lastname = lastname;
        }

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        } else {
            user.email = email;
        }

        if (!phoneno) {
            return res.status(400).json({
                error: 'Phone No is required'
            });
        } else {
            user.phoneno = phoneno;
        }

        if (!addressl1) {
            return res.status(400).json({
                error: 'Address Line 1 is required'
            });
        } else {
            user.addressl1 = addressl1;
        }

        if (!addressl2) {
            return res.status(400).json({
                error: 'addressl2 is required'
            });
        } else {
            user.addressl2 = addressl2;
        }
        if (!city) {
            return res.status(400).json({
                error: 'city is required'
            });
        } else {
            user.city = city;
        }

        if (!postalcode) {
            return res.status(400).json({
                error: 'postalcode is required'
            });
        } else {
            user.postalcode = postalcode;
        }


        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};

// delete user by userId
/*exports.deleteuser =(req, res) => {
    let user  = req.profile;

    user.remove((err,data)=>{

        if(err) return res.status(400).json({err});

        res.json({data,message:"User deleted successfully"});

    })
};*/

// delete user by userId
exports.deleteuser =(req, res) => {
    let user  = req.profile;

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://wssuper:mern@cluster0.ee9hx.mongodb.net/wickramasuperdb?retryWrites=true&w=majority";
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wickramasuperdb");

      dbo.collection("deleted_users").insertOne(user, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        
      });

      dbo.collection("users").deleteOne(user, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();

      });

      res.json({message:"User deleted successfully"});

    }); 



    /*user.remove((err,data)=>{

        if(err) return res.status(400).json({err});

        res.json({data,message:"User deleted successfully"});

    })*/
};

exports.userList = (req, res) => {
    User.find().exec((err, data) => {
        User.salt = undefined;
        User.hashed_password = undefined;
        if(err) {
            return res.status(400).json({
                error : 'sdsfs'
            })
        }
        else {
            res.json(data)
        }
    })
}







