var Admin = require("../../models/admin");
module.exports = (req, res) => {
  Admin.findOne({"task.taskname": req.params.taskname }, (err, result) => {
    var nname = req.params.taskname;
    if (err) {
      res.json({
        status: 400,
        success: false,
        message: err,
      });
    } else {
      var disptask = result.task.find(x=>x.taskname === nname);
      res.json(disptask);
    }
  });
};
