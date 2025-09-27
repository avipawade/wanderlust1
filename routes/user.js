const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const{rendersignupform,signup,renderloginform,login,logout}= require("../controllers/users.js")


router
    .route("/signup")
    .get(rendersignupform)
    .post(wrapAsync(signup));




router
    .route("/login")
    .get(renderloginform)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(login))

router.get("/logout",logout)
module.exports = router;