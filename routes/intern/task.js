var Task = require("../../models/task");
module.exports = (req, res) => {
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
}