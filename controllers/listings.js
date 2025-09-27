const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index =  async(req,res)=>{
const listings = await Listing.find({});
res.render("./listings/index.ejs",{listings});
}

module.exports.newlist = (req,res)=>{
    res.render("./listings/new.ejs")
}

module.exports.showlist =  async (req,res)=>{
    let {id}= req.params;
    const list = await Listing.findById(id).populate({path : "reviews" ,populate:{path : "author"}}).populate("owner");

    if(!list){
      req.flash("error","list you requested that not exist");
      res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{list});

}

module.exports.createlist =  async(req, res ,next) => {

  let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
  })
  .send();
  let url = req.file.path;
  let filename = req.file.filename;
//   const { ntitle, ndescription, nlocation, nprice ,nimage } = req.body;

//   const add = new Listing({
//     title: ntitle,
//     description: ndescription,
//     image :nimage,
//     location: nlocation,
//     price: nprice
//   });

  //  if(!req.body.listing){
  //   throw new ExpressError(404 , "send valid data for listing")
  //  }

    const newlisting = new Listing (req.body.listing);

  //   if(!add.title){
  //   throw new ExpressError(404 , "title is missing")
  //  }
  //   if(!add.price){
  //   throw new ExpressError(404 , "price is missing")
  //  }
  //   if(!add.description){
  //   throw new ExpressError(404 , "description is missing")
  //  }
  //   if(!add.location){
  //   throw new ExpressError(404 , "location is missing")
  //  } 


  newlisting.owner = req.user._id;
  newlisting.image = {url,filename} ;
  newlisting.geometry=response.body.features[0].geometry;
  let savedlisting = await newlisting.save();
  console.log(savedlisting);
  req.flash("success","List added successfully");
  res.redirect("/listings");
} 
module.exports.editlist =  async(req,res)=>{
    let{id}= req.params;
    let listing = await Listing.findById(id);
     if(!listing){
      req.flash("error","list you requested that not exist");
      res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
  }

module.exports.updatelist =  async(req,res)=>{
   let{id}= req.params;
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file != "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename} ;
     await listing.save();
   }
   req.flash("success","List updated successfully");
   return res.redirect(`/listings/${id}`);
  
  }

  module.exports.destroylist =  async(req,res)=>{
    let{id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","List deleted successfully");
     res.redirect("/listings");
  }