var User = require("../../models/user");
module.exports = (req, res)=>{
	User.find({"username":req.params.username},(err, result)=>{
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
	});
}