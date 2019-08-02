var express=require("express"),
 	app=express(),
 	mongoose=require("mongoose"),
	flash=require("connect-flash"),
	bodyParser=require("body-parser"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Recipe=require("./models/recipe"),
	Comment=require("./models/comment"),
	User=require("./models/user");
    seedDB=require("./seed");

var commentRoutes   =require("./routes/comments"),
	recipeRoutes=require("./routes/recipes"),
	indexRoutes     =require("./routes/index");



mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));//(__dirname=dierctory name.. use this for more safety.)
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();



//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret:"Rusty is the cute dog",		// it canbe anything
		resave:false,
		saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// User.authenticate() is amethod comes with passport-local-mongoose.
													// if we didnt install that package we have to write the code for 																authenticate.we have 2 more methods. serialize and deser.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware function for curremt user:Available to all pages
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.success=req.flash("success");//make message value available to all pages.bcoz message is given in the header 
	res.locals.error=req.flash("error");                                      //file
	next();
});



app.use(indexRoutes);
app.use("/recipes",recipeRoutes);
app.use("/recipes/:id/comments",commentRoutes);







//Schema setUp

//var campgroundSchema=new mongoose.Schema({name:String, image:String, description:String});
//var Campground=mongoose.model("Campground",campgroundSchema);
// Campground.create(
// {
// 		name:"Puppy", 
// 		image:"https://images.unsplash.com/photo-1558981130-93d25a4d4212?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
// 	description:"This is a huge campground. No water but beautiful"
// 	}, function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("good");
// 			console.log(campground);
// 		}
// 	});





 //========================================================================
//campground routes
//===========================================================================








app.listen(3001,  ()=> {
  console.log("Server Up!");
});