var Admin = require("../../models/admin");
module.exports = (req, res) => {
  Admin.findOne({"regno": req.params.regno }, (err, result) => {
    if (err) {
      res.json({
        status: 400,
        success: false,
        message: err,
      });
    } else {
      var disptask = result.task;
      res.json(disptask);
    }
  });
};