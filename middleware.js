const Listing=require("./models/listings");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You're not login, Please login first");
        res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUsr._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{

    let {error}=listingSchema.validate(req.body,{abortEarly:false});
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUsr._id)){
        req.flash("error","You're not author of this review!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}