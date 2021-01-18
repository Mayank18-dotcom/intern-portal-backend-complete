var Task = require("../../models/task");
module.exports = (req, res) => {
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
  }