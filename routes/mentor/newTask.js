var Task = require("../../models/task");
module.exports = (req,res)=>{
    var newtask = new Task({
      options:req.body.options,
      email:req.body.email,
      username: req.body.username,
      taskname:req.body.taskname,
      taskdetails:req.body.taskdetails,
      enddate:req.body.enddate,
      link:req.body.link,
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
}