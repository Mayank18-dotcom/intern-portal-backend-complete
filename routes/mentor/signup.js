var Admin = require("../../models/admin");
module.exports = async(req, res) => {
    const admin = new Admin(req.body)
    try{
      await admin.save()
      const token = await admin.generateauthtoken()
      res.status(201).json({admin, token})
    } catch(e){
      res.status(400).send("Username / RegNo. already exists");
    }
}