var express=require("express");
var router=express.Router();
var Recipe=require("../models/recipe");
var middleware=require("../middleware");// we dont want to specify index.js bcoz "index' is a name that expess knows.

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');

cloudinary.config({ 
  	cloud_name: 'dipbdmmob', 
	api_key: "841449579588191",  
	api_secret:"r7rJ8gcKOCfFJm4-6ITsAJWBUzg" });




//index-showing all campgrounds
// In this we have passed req.user to know about current user. if logged in req.user will give current username  and id. else undefined. it is then passed to header through campground  page. But this will not be availabel on any other routes. So we have to give this to every route. So instead of doing it manually we can add a middleware function.

router.get("/", function(req,res){
	
	//get all campgrounds from DB
	Recipe.find({},function(err,allRecipes){
		if(err){
			console.log(err);
		}
		else{
			res.render("recipes/recipes",{recipes:allRecipes}); //currentUser:req.user//});
			
		}
	});
	
});


//Create- route
router.post("/",middleware.isLoggedIn,upload.single('image'), function(req,res){
	cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.recipe.image = result.secure_url;
  // add author to campground
  req.body.recipe.author = {
    id: req.user._id,
    username: req.user.username
  };
  console.log(req.body.recipe);
  Recipe.create(req.body.recipe, function(err, recipe) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/recipes/' + recipe.id);
  });
});
});
	
//NEW-route:for showing a form
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("recipes/new");
});

//SHOW-route: one entity in detail
router.get("/:id",function(req,res){
	//find out the auto generated id for the campground(can see from html of moreinfo link).It is stored in req.params.
	//here we can use mongoose 
	//==>Campground.findById(req.params.id,function(err,foundCampground){
	//the comment is pushed to campground as an objId.. we want the actual comment.. for that we have to 
	// populate and execute that query.ie, we findout the campground by id and populated its comment. the
	//foundCampground now consists of comments.
	Recipe.findById(req.params.id).populate("comments").exec(function(err,foundRecipe){
		if(err){
			console.log(err);
		}else
		{
			console.log(foundRecipe);
			res.render("recipes/show",{recipe:foundRecipe});}
	});
});

//EDIT CAMPGROUND ROUTE: show the form to edit and submit to update route
	
router.get("/:id/edit",middleware.checkRecipeOwnership,upload.single('image'),function(req,res){
	Recipe.findById(req.params.id,function(err,recipefound){
		res.render("recipes/edit",{recipe:recipefound});
			
			
		});
	});
	
	
	
	


//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkRecipeOwnership,function(req,res){
	Recipe.findByIdAndUpdate(req.params.id,req.body.recipe,function(err,updatedrecipe){
		if(err){
			res.redirect("/recipes");
			
		}else{
			res.redirect("/recipes/"+req.params.id); 
		}
	});
});

//DELETE
router.delete("/:id",middleware.checkRecipeOwnership,function(req,res){
	Recipe.findByIdAndRemove(req.params.id,req.body.recipe,function(err,updatedrecipe){
		if(err){
			console.log(err);
			
		}else{
			res.redirect("/recipes");
		}
	});
	});


// function checkCampgroundOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,function(err,campgroundfound){
// 		if(err){
// 			res.redirect("back");
// 		}else{
// 			if(campgroundfound.author.id.equals(req.user._id)){
// 				next();// if everything fine then move on to next line of code in the called fun. ie, edit/update /delete
// 			}else{
// 				res.redirect("back");
// 			}
			
// 		}//1.a if yes, is author==user; req.params.id is a string and campgroundfound.author.id is a mongoose object. so                cant compare. so use mongoose method .equals().
			
			
// 		});
	
// 	}else{
// 		res.redirect("back");
// 	}

// }



// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}else{
// 		res.redirect("/login");
// 	}
	
// }

module.exports=router;





































