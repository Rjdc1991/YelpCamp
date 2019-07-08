require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash=require("connect-flash"),
    LocalStrategy = require("passport-local"),
    Campground=require("./models/campgrounds"),
    seedDB = require("./seeds.js"),
    Comment = require("./models/comments"),
    User= require("./models/user"),
    methodOverride = require("method-override"),
    passport = require("passport");
    
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");
    
mongoose.connect("mongodb://localhost/yelp_camp_V9", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); 

//PASSPORT CONFIGURATION
//-----------
app.use(require("express-session")({
    
    secret:"SECRET!",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000,() => {
    
    console.log("running");
    
});