var User = require("../../models/user");
var Admin = require("../../models/admin");
var allInterns = [];
module.exports = (req, res) => {
  User.find({ options: req.params.options }, (err, ress) => {
    if (err) {
      console.log(err);
    } else {
      allInterns = ress;
      console.log(allInterns);
      var newtask = {
        taskname: req.body.taskname,
        //enddate: req.body.enddate,
        taskdetails: req.body.taskdetails,
        link: req.body.link,
      };
      var newTaskname = req.body.taskname;
      var enddate = req.body.enddate;
      Admin.findOneAndUpdate(
        { regno: req.params.options },
        { $push: { task: newtask } },
        (err, result) => {
          if (err) {
            res.json({
              status: 400,
              success: false,
              message: err,
            });
          } else {
            var newtask1 = [];
            allInterns.forEach((ele) => {
              newtask1.push({
                "internname": ele.username,
                "internemail":ele.email,
                "enddate":enddate,
                "complete": "Incomplete",
                "remark": "N/A",
              });
            });
            console.log(`Task is ${newTaskname}`);
            Admin.findOneAndUpdate(
              { "task.taskname": newTaskname },
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
        }
      );
    }
  });
};