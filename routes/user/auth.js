const express = require("express");
const router = express.Router();

const { user_signup, user_signin, user_signout, adminPage} = require("../../controllers/user/auth");
const {userSignupValidator} = require("../../validator/user");

router.post("/adminPage", adminPage);

router.post("/user_signin", user_signin);
router.get("/user_signout", user_signout);




module.exports = router;