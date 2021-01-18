var User = require("../../models/user");
module.exports = (req, res) => {
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
}