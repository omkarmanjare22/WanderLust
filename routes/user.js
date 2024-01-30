const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl, isLoggedIn}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signUp.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","User was registered successfuly");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",redirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),(async(req,res)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You're logged out now");
        res.redirect("/listings");
    });
});

module.exports=router;