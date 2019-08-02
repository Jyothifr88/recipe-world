var express=require("express");
var router=express.Router({mergeParams: true});
var Recipe=require("../models/recipe");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//=================================================================================================
//comments routes
//=============================================================================================

router.get("/new",middleware.isLoggedIn,function(req,res){
	Recipe.findById(req.params.id,function(err,recipe){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{recipe:recipe});
		}
	});

});
// isLoggedIn is used as a middleware in above route to prevent nonlogged users. This also added to below post request.
// because above is just preventing users fromm seeing the comment form. still users can send post request to comment through postman. so we added isLoggedIn in post request also.


router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground using ID
	Recipe.findById(req.params.id,function(err,recipe){
		if(err){
			console.log(err);
		}else{//=>req.body.comment==>possible because in form name=comment[text] and comment[author]
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}else{
					//add username and id to comments for user associations
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save comment
					comment.save();
					recipe.comments.push(comment);
					recipe.save();
					req.flash("Success","Successfully added comment");
					res.redirect("/recipes/"+recipe._id);
				}
			});
			
		}
	});
	//create new comment
	//connect new comment to campground
	//redirect campground show page
	
});
//COMMENT EDIT ROUTE: route is:campgrounds/:id/comments/:id/edit==> two id==>so 2nd id named as comment_id.
//here req.params.id is first id=campground id.

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id, function(err,commentfound){
		res.render("comments/edit",{recipe_id:req.params.id, comment:commentfound});
				
	});
	
});
//COMMENT UPDATE route:/campgrounds/:id/comments/:comment_id
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComments){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/recipes/"+ req.params.id);
		}
	});
});
//COMMENT DELETE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	
	Comment.findByIdAndRemove(req.params.comment_id,req.body.comment,function(err,deleteComment){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/recipes/"+req.params.id);
		}
	});
});

// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id,function(err,commentfound){
// 			if(err){
// 			res.redirect("back");
// 		}else{
// 			if(commentfound.author.id.equals(req.user._id)){
// 				next();// if everything fine then move on to next line of code in the called fun. ie, edit/update /delete
// 			}else{
// 				res.redirect("back");
// 			}
			
// 		}
// 		});
	
	
// 	}else{
// 		res.redirect("back");
// 	}

// }


// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }
module.exports=router;