var Task = require("../../models/task");
module.exports = (req, res) => {
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
}