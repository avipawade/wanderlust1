const express = require("express");
const router = express.Router({mergeParams:true});

const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{validateReview,isloggedin,isreviewAuthor}= require("../middleware.js")

const{createreview,destroyreview}= require("../controllers/reviews.js");

router.post("/" ,isloggedin,validateReview,wrapAsync(createreview))

router.delete("/:reviewId",isloggedin,isreviewAuthor,wrapAsync(destroyreview))

  module.exports = router;