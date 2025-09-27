
const express = require("express");
const router = express.Router(); 


const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const passport = require("passport");
const{isloggedin,isOwner,validateListing}= require("../middleware.js")

const{index,newlist,showlist,createlist,editlist,updatelist, destroylist}= require("../controllers/listings.js")

const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({storage});




router
    .route("/")
    .get(wrapAsync(index))

    .post(isloggedin,upload.single('listing[image]'),validateListing,wrapAsync(createlist));


router.get("/new" ,isloggedin,newlist)

router
    .route("/:id")
    .get(wrapAsync(showlist))
    .put(isloggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(updatelist))
    .delete(isloggedin,isOwner,wrapAsync(destroylist))



router.get("/:id/edit" ,isloggedin,isOwner,wrapAsync(editlist));




module.exports = router;