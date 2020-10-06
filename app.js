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

 
app.post("/user/signup",cors(), async(req, res) => {
  const user = new User(req.body)
  try{
    await user.save()
    const token = await user.generateauthtoken()
    res.status(201).json({user, token})
  } catch(e){
    res.status(400).send("Username / RegNo. already exists");
  }
});


app.post("/user/login",cors(), async(req, res)=> {
  try{
    const user = await User.findbycredentials(req.body.username, req.body.password);
    const token = await user.generateauthtoken()
    res.status(200).send({user, token}); 

  } catch(e){
    res.status(400).send("Wrong Credentials");
}
});

//logout route
app.post("/user/logout", auth,cors(), async(req, res)=> {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  }catch(e){
    res.status(500)
  }
})

//logout out of all sessions
app.post("/user/logoutall", auth, async(req, res)=> {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500);
  }
})

app.get("/user/dashboard/:username",auth, (req,res)=>{
  Task.find({"username":req.params.username},(err,result)=>{
    if(err){
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
      res.json(result);
    }
  })
})

app.get('/user/taskone',  auth, (req, res) => {
  var id=req.query.id;
  Task.findOne({"_id":id},(err, result) => {
    if (err) {
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
    res.json(result);
    }
  })
})

//Profile
app.get("/user/profile/:username", auth,(req, res)=>{
	User.find({"username":req.params.username},(err, result)=>{
	if (err) {
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
          res.json(result);
    }
	});
});


//UPDATE ROUTE
app.patch("/user/profile", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password", "regno"];
    const isValidOperation = updates.every(element =>
      allowedUpdates.includes(element)
    );
    if (!isValidOperation) res.status(400).send({ error: "Invalid updates" });
    updates.forEach(element => (req.user[element] = req.body[element]));
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/********************************************************************************************************************************* */


//ADMIN PORTAL

app.post("/admin/signup",cors(), async(req, res) => {
  const admin = new Admin(req.body)
  try{
    await admin.save()
    const token = await admin.generateauthtoken()
    res.status(201).json({admin, token})
  } catch(e){
    res.status(400).send("Username / RegNo. already exists");
  }
});

app.post("/admin/login", async(req, res)=> {
  try{
    const admin = await Admin.findbycredentials(req.body.username, req.body.password);
    const token = await admin.generateauthtoken()
    res.status(200).send({admin, token}); 

  } catch(e){
    res.status(400).send("Wrong Credentials");
}
});

//logout route
app.post("/admin/logout", admauth, async(req, res)=> {
  try{
    req.admin.tokens = req.admin.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.admin.save()

    res.send()
  }catch(e){
    res.status(500)
  }
})

//logout out of all sessions
app.post("/admin/logoutall", admauth, async(req, res)=> {
  try{
    req.admin.tokens = []
    await req.admin.save()
    res.send()
  }catch(e){
    res.status(500);
  }
})
//POSTING A NEW TASK

app.post('/admin/addtask', admauth,(req,res)=>{
  var newtask = new Task({
    options:req.body.options,
    username: req.body.username,
    taskname:req.body.taskname,
    taskdetails:req.body.taskdetails,
    enddate:req.body.enddate,
    complete:req.body.complete
  })
  Task.create(newtask,(err,result)=>{
    if(err){
      res.json(err)
    }
    else{
      res.json(result)
    }
  })
})


app.get('/alladmins',(req,res)=>{
  Admin.find({},(err,result)=>{
    if(err){
      res.send(err)
    }
    else{
      res.json(result);
      console.log(result);
    }
  })
})
// Dashboard for the admin
app.get("/admin/dashboard/:options", admauth, (req, res) => {
  User.find({"options":req.params.options}, (err, result) => {
    if(err){
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
      res.json(result);
    }
  })
});

//Displaying all the interns for a particular admin

app.get("/admin/dashboard/tasks/:username",  admauth, (req, res) => {
    Task.find({"username":req.params.username}, (err, result) => {
    if(err){
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
      res.json(result);
    }
  })
});

//Getting each task
app.get('/admin/dashboard/taskone/:id',  admauth, (req, res) => {
    Task.findOne({"_id":req.params.id},(err, result) => {
    if (err) {
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
    res.json(result);
    }
  })
})

//delete taskone
app.get('/admin/dashboard/taskone/delete/:id',  admauth, (req, res) => {
    Task.deleteOne({"_id":req.params.id},(err, result) => {
    if (err) {
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
		console.log(result);
    res.json(result);
    }
  })
})


// Incomplete to complete
app.post('/admin/dashboard/taskone/complete', admauth, (req, res) => {
  var id=req.body.id;
  var mongo= require("mongodb");
  var eventid=new mongo.ObjectId(id);
Task.findOneAndUpdate({"_id":eventid}, {
    $set: {
    complete: "Completed",
    }
},(err, result) => {
        if (err)  {
          res.json({
            status:400,
            success:false,
            message:err
          })
        }
        else{
        res.json({
          success:true,
          status:200
        })
      }
        console.log('Completed')
    })
});


//REMARK ROUTE
app.post('/admin/dashboard/taskone/remark/:id', admauth, (req, res) => {
Task.findOneAndUpdate({"_id":req.params.id}, {
    remark: req.body.remark,
},(err, result) => {
        if (err)  {
          res.json({
            success:false,
            message:err
          })
        }
        else{
          res.json({
            success:true,
            status:200
          })
      }
      console.log('Remark complete')
    })
});



// Complete to Incomplete
app.post('/admin/dashboard/taskone/incomplete', admauth, (req, res) => {
  var id=req.body.id;
  var mongo= require("mongodb");
  var eventid=new mongo.ObjectId(id);
Task.findOneAndUpdate({"_id":eventid}, {
    $set: {
    complete: "Incomplete",
    }
},(err, result) => {
        if (err)  {
          res.json({
            status:400,
            success:false,
            message:err
          })
        }
        else{
        res.json({
          success:true,
          status:200
        })
      }
        console.log('Incomplete')
    })
})

//PROFILE OF ADMIN
app.get("/admin/profile/:regno", admauth,(req, res)=>{
	Admin.find({"regno":req.params.regno},(err, result)=>{
	if (err) {
      res.json({
        status:400,
        success:false,
        message:err
      })
    }
    else{
          res.json(result);
    }
	});
});

//UPDATE ROUTE FOR ADMIN
app.patch("/admin/profile", admauth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password", "regno"];
    const isValidOperation = updates.every(element =>
      allowedUpdates.includes(element)
    );
    if (!isValidOperation) res.status(400).send({ error: "Invalid updates" });
    updates.forEach(element => (req.admin[element] = req.body[element]));
    await req.admin.save();
    res.json(req.admin);
  } catch (error) {
    res.status(400).send(error);
  }
});

/*********************************************************************************************************************************************************** */
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server started");
});