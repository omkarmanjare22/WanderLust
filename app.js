// Required Necessory Packages
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listings.js");
const methodOverride=require("method-override");

// Connecte to DB
main().then(()=>{
    console.log("Connected to DB Sucess");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

// Set Default Values
app.set("view eingine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//establish Server Connection
app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});

// Root Route
app.get("/",(req,res)=>{
    res.send("I am Root");
});

// Main All Listing Route
app.get("/listings",async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
});

// New Listing Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Post Route for save changes in DB
app.post("/listings",async (req,res)=>{
    let listing= new Listing(req.body.Listing);
    await listing.save();   
    res.redirect("/listings");
});

// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// Update Route
app.put("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
});

// Show Route
app.get("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

// Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
});

