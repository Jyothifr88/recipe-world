var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/", function(req,res){
	res.render("landing");
});

//===========================================================================================
//AUTH ROUTES//Add register routes
//=============================================================================================



//Show register form
router.get("/register",function(req,res){
	res.render("register");
});

//handle reg form/signUp handling
router.post("/register",function(req,res){
	//User.register(new User({username:req.body.username}),req.body.password);// User.register is method of passport-loacal-mongoose which register a new user whode username is taken from req.body. and password is given as a second argument of User.register().This can be rewritten as follows
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res, function(){
			req.flash("success","Welcome to yelpCamp"+user.username);
			res.redirect("/recipes");
		});
	});// register will register a new user with username and password as hashcode. Then they will sign in and authenticate and redirect. if you type the same user name you will get error msg. it is because of passport-local -mongoose. but as for now it is not displayed on page.but only in console.passport.authenticate is middleware used for authinatication
	
	
});
// SHOW LOGIN FORM
router.get("/login",function(req,res){
	res.render("login");
});
//HANDLING LOGIN LOGIC
//This is done using paaport.authenticate middleware with two arguments local and an object. that object have two things
//successRedirect and failure redirect. if succes it will take to "/campgrounds".
router.post("/login",passport.authenticate("local",{
	successRedirect:"/recipes",
	failureRedirect:"/login"
}),function(req,res){
	res.send("ok");
});

//LOGOUT ROUTE
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","loggedOut Successfully");
	res.redirect("/recipes");
});

//we want to check weather the user is logged in or not. if logged in mob=ve to next else redirect to login.
//we canuse this function where ever we want. next is a function. This function can be used as a middleware==> This function
// will execute first. if authenticated then next function will run. we can use this to block non logged users from adding
//comment


module.exports=router;