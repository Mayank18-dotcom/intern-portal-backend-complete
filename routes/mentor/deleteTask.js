var Admin = require("../../models/admin");
module.exports = (req, res) => {
  var username = req.params.username;
  var taskname = req.params.taskname;
  var remarks = req.body.remarks;
  Admin.findOne({"task.taskname": taskname}, (err, result) => {
    var nname = req.params.taskname;
    if (err) {
      res.json({
        status: 400,
        success: false,
        message: err,
      });
    } else {
      var allInterns = result.task.find(x=>x.taskname === nname).interns;
      var okok = allInterns.find(y=>y.internname === username);
      okok.internname = "";
      
      var newtask1 = [];
      allInterns.forEach((ele) => {
        if(ele.internname !== "")
        {
          newtask1.push({
            "internname": ele.internname,
            "internemail":ele.internemail,
            "complete": ele.complete,
            "enddate":ele.enddate,
            "remark": ele.remark,
          });
        }
      });
      Admin.findOneAndUpdate({"task.taskname": taskname},
      { $set: { "task.$.interns": [] } },(err,result)=>{
        if (err) {
          res.json({
            status: 400,
            success: false,
            message: err,
          });
        }
        else{
          Admin.findOneAndUpdate(
            { "task.taskname": taskname },
            { $push: { "task.$.interns": { $each: newtask1 } } },
            (err, result) => {
              if (err) {
                res.json(err);
              } else {
                res.json(result);
              }
            }
          );
        }
      })
    }
  });
};