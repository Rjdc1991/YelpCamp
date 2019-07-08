var middlewareObj = {};
var Campground=require("../models/campgrounds");
var Comment=require("../models/comments");

middlewareObj.checkOwnership=function(req,res,next){
    
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }else{
                //does user own this campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not own that post")
                    res.redirect("/campgrounds");
                }
             }
    });
        }else {
        req.flash("error", "Campground not found")
        res.redirect("/register");
    }
};

middlewareObj.checkCommentOwnership=function(req,res,next){
    
   if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found")
                res.redirect("/campgrounds");
            }else{
                //does user own this comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
             }
    });
        }else {
        
        res.redirect("back");
    }

};

middlewareObj.isLoggedIn=function(req,res,next){
    
   if(req.isAuthenticated()){
        
        return next();
    }
    
    req.flash("error","Please login first");
    res.redirect("/login");
    
};




module.exports = middlewareObj;