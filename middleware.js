const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You Must Be Logged In");
    return res.redirect("/login");
  }
next()
;}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
next()
;}


module.exports.isOwner = async(req,res,next)=>{
  let{id}= req.params;
  let listing = await Listing.findById(id);
  if(!(listing.owner._id.equals(res.locals.currUser._id))){
  req.flash("error" , "You Dont Have Permission to Change the List Data");
  return res.redirect(`/listings/${id}`);
  }
next()
;}

module.exports.validateListing = (req,res,next)=>{
 let result = listingSchema.validate(req.body);
  if(result.error){
    throw new ExpressError(400,result.error)
  }
  else{
    next();
  }
}


module.exports.validateReview = (req,res,next)=>{
 let result = reviewSchema.validate(req.body);
  if(result.error){
    throw new ExpressError(400,result.error)
  }
  else{
    next();
  }
}

module.exports.isreviewAuthor = async(req,res,next)=>{
  let{reviewId,id}= req.params;
  let review = await Review.findById(reviewId);
  if(!(review.author._id.equals(res.locals.currUser._id))){
  req.flash("error" , "You Dont Have Permission to edit review");
  return res.redirect(`/listings/${id}`);
  }
next()  
;}