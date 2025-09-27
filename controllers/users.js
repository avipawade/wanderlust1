const User = require("../models/user.js");

module.exports.rendersignupform =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
try{
    let{username,email,password}=req.body;
let newUser = new User({username,email});
const regUser = await User.register(newUser,password);
req.login(regUser , (err)=>{
    if(err){
      return  next(err);
    }
    req.flash("success","Successfully Logged in");
    res.redirect("/listings");
    })
}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}

module.exports.renderloginform =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login =async(req,res)=>{
req.flash("success","You Are Logged In Wnaderlust!!"); 
if(!res.locals.redirectUrl){
    res.redirect("/listings");
}
res.redirect(res.locals.redirectUrl);
}

module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
    if(err){
      return  next(err);
    }
    req.flash("success","Successfully Logged Out");
    res.redirect("/listings");
    })
}