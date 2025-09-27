const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("connected to db");
})

.catch((err)=>{
    console.log(err);
})


const initdb = async ()=>{
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj,owner:"68c02a7055029c877f8d4768"}));
   await Listing.insertMany(initdata.data);
   console.log("data was intialized");
}

initdb();