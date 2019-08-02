// all the middleware goes here. we will add all the required functions to an object(=middleware obj) and will export this obj
var Recipe=require("../models/recipe");
var Comment=require("../models/comment");
var middlewareObj={};
middlewareObj.checkRecipeOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Recipe.findById(req.params.id,function(err,recipefound){
		if(err){
			req.flash("error","Recipe not found");
			res.redirect("back");
		}else{
			if(recipefound.author.id.equals(req.user._id)){
				next();// if everything fine then move on to next line of code in the called fun. ie, edit/update /delete
			}else{
				req.flash("error","Permission Denied");
				res.redirect("back");
			}
			
		}//1.a if yes, is author==user; req.params.id is a string and campgroundfound.author.id is a mongoose object. so                cant compare. so use mongoose method .equals().
			
			
		});
	
	}else{
		req.flash("error","Please login");
		res.redirect("back");
	}

};
middlewareObj.checkCommentOwnership=function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,commentfound){
			if(err){
			req.flash("error","Recipe not found");
			res.redirect("back");
		}else{
			if(commentfound.author.id.equals(req.user._id)){
				next();// if everything fine then move on to next line of code in the called fun. ie, edit/update /delete
			}else{
				req.flash("error","Permission Denied");
				res.redirect("back");
			}
			
		}
		});
	
	
	}else{
		req.flash("error","Please login");
		res.redirect("back");
	}

};
middlewareObj.isLoggedIn=function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error","Please login");
		res.redirect("/login");
	}
	
};



	

	

module.exports=middlewareObj;
