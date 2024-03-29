var express = require("express");
var router = express.Router({mergeParams:true});
var Campground= require("../models/campgrounds");
var Comment= require("../models/comments");
var middleware=require("../middleware");


router.get("/new",middleware.isLoggedIn, function(req, res) {
    
      Campground.findById(req.params.id, function(err,campground){
        
        if(err){
            
            console.log(err);
        } else{
            
            res.render("comments/new", {campground: campground});
        }
    });
    
});

router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment._id);
               campground.save();
               req.flash("success","Comment posted!")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("/campgrounds");
    }
        Comment.findById(req.params.comment_id, function(err, foundComment){
               
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        
        if(err){
            
            res.redirect("back");
        }else {
            
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    
    Comment.findByIdAndDelete(req.params.comment_id, req.body.comment,function(err,updatedComment){
        
        if(err){
            
            res.redirect("back");
        }else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
    
       







module.exports= router;