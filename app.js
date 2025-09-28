if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("express-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL


main()
.then(()=>{
  console.log("connected to db");
})

.catch((err)=>{
  console.log(err);
})

async function main(){
await mongoose.connect(dburl) 
};




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views")); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store =  MongoStore.create({
   mongoUrl: process.env.ATLASDB_URL,
     crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,

});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionpotions = {
  store,
  secret :process.env.SECRET,
  saveUninitialized : true,
  resave : false,
  cookie : {
    expires : Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge :  7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
}

const wrapAsync = require("./utils/wrapAsync.js");

const {listingSchema , reviewSchema} = require("./schema.js");

app.use(session(sessionpotions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")

app.get("/demouser",async(req,res)=>{
 let fakeuser = new User({
  email : "avi2004@gmail.com",
  username :"delta-s",
 })

let registereduser =  await User.register(fakeuser,"Avi@1234");
res.send(registereduser);
})

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
// app.get("/testlisting",async(req,res)=>{
//     let newlisting =  new Listing({
//         title : " My New Villa",
//         description : "by beach",
//         price:1000,
//         location:"calangut,Goa,India",
//         Country : "India"
//     })

//     await newlisting.save();
//     console.log("sample was saved");
//     res.send("succesfuuly testing");
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

  app.all("*",async(req,res,next)=>{
     next(new ExpressError(404,"Page Not Found !!"));
  });

  app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
  });


  // app.use((err,req,res,next)=>{
  //   res.send("something is wrong!!");
  // })
  
  // reviews 
  // post route 



app.listen(8080,()=>{
    console.log("Listening on port 8080");
})
