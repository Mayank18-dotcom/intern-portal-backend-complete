var Admin = require("../../models/admin");
module.exports = (req,res)=>{
    Admin.find({},(err,result)=>{
      if(err){
        res.send(err)
      }
      else{
        res.json(result);
        console.log(result);
      }
    })
}