var Task = require("../../models/task");
module.exports = (req, res) => {
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
}