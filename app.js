var express  = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var User = require("./models/user");
var Task = require("./models/task");
var Admin = require("./models/admin");
var auth = require("./middleware/auth");
var admauth = require("./middleware/admauth");
var passport = require('passport');
var LocalStrategy  = require('passport-local');
var passportLocalMongoose  = require('passport-local-mongoose');
var bcrypt= require('bcrypt-nodejs');
const { use } = require('passport');
const jwt = require("jsonwebtoken");
var cors = require('cors')

/*********************************************************************************************************************************************************** */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//database connection
mongoose.connect("mongodb+srv://admindb:admindatabase@cluster0-vlwic.mongodb.net/portaldata",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

mongoose.set('useFindAndModify', false);

/*********************************************************************************************************************************************************** */
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

/*********************************************************************************************************************************************************** */
//INTERN

//signup route
var signupIntern = require("./routes/intern/signup");
app.post("/user/signup",cors(), signupIntern);

//login route
var loginIntern = require("./routes/intern/login");
app.post("/user/login",cors(),loginIntern);

//logout route
var logoutIntern = require("./routes/intern/logout");
app.post("/user/logout", auth,cors(), logoutIntern);

//dashboard
var internDash = require("./routes/intern/dashboard");
app.get("/user/dashboard/:username",auth, internDash)

//oneTask
var internTask = require("./routes/intern/task");
app.get('/user/taskone',  auth, internTask);

//Profile
var internProfile = require("./routes/intern/profile");
app.get("/user/profile/:username", auth,internProfile);


//UPDATE ROUTE
var updateProfile = require("./routes/intern/updateProfile");
app.patch("/user/profile", auth, updateProfile);


/*********************************************************************************************************************************************************** */
//MENTOR

//signup
var mentorSignup = require("./routes/mentor/signup");
app.post("/admin/signup",cors(), mentorSignup);

//login
var loginMentor = require("./routes/mentor/login");
app.post("/admin/login",loginMentor);

//logout route
var logoutMentor = require("./routes/mentor/logout");
app.post("/admin/logout", admauth,logoutMentor );

//POSTING A NEW TASK
var newTask = require("./routes/mentor/newTask");
app.post('/admin/addtask', admauth,newTask);

//get all admins
var allMentors = require("./routes/mentor/allMentors");
app.get('/alladmins',allMentors);

// Dashboard for the admin
var mentorDash = require("./routes/mentor/dashboard");
app.get("/admin/dashboard/:options", admauth, mentorDash);

//Displaying all the interns for a particular admin
var allInterns = require("./routes/mentor/allInternList");
app.get("/admin/dashboard/tasks/:username",  admauth, allInterns);

//Getting each task
var getOneTask = require("./routes/mentor/oneTask");
app.get('/admin/dashboard/taskone/:id',  admauth, getOneTask);

//delete taskone
var delTask = require("./routes/mentor/deleteTask");
app.get('/admin/dashboard/taskone/delete/:id',  admauth, delTask);

// Incomplete to complete
var incompTocomp = require("./routes/mentor/incompTocomp");
app.post('/admin/dashboard/taskone/complete', admauth, incompTocomp);

// Complete to Incomplete
var compToIncomp = require("./routes/mentor/compToIncomp");
app.post('/admin/dashboard/taskone/incomplete', admauth, compToIncomp);

//Remark route
var remarks = require("./routes/mentor/remark");
app.post('/admin/dashboard/taskone/remark/:id', admauth, remarks);

//PROFILE OF MENTOR
var mentorProfile = require("./routes/mentor/profile");
app.get("/admin/profile/:regno", admauth,mentorProfile);

//UPDATE ROUTE FOR MENTOR
var updateMentorProfile = require("./routes/mentor/updateProfile");
app.patch("/admin/profile", admauth, updateMentorProfile);


/*********************************************************************************************************************************************************** */
//OTHERS + ADMINS
var mailScheudler = require("./routes/admins/sendemail");
app.get("/",mailScheudler);

/*********************************************************************************************************************************************************** */
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server started");
});