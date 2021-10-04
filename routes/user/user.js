const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../../controllers/user/auth"); //isAuth & isAdmin i put here later

const { read,update,userById,deleteuser } = require("../../controllers/user/user");

const { userList } = require("../../controllers/user/user");

const user = require("../../models/user/user");
//for delete
const auth = require("../../controllers/user/auth");

router.get("/secret/:userId", requireSignin, isAuth, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.param('userId', userById);
router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', update);

// try to delete a user by id. this is testing one
router.delete('/delete/:userId', deleteuser);

router.get('/userslist', userList)



module.exports = router;