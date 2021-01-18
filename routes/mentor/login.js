var Admin = require("../../models/admin");

module.exports = async function (req,res){
  try{
        const admin = await Admin.findbycredentials(req.body.username, req.body.password);
        const token = await admin.generateauthtoken()
        res.status(200).send({admin, token}); 
    
      } catch(e){
        res.status(400).send("Wrong Credentials");
    }
}