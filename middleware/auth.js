const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { findOne } = require("../models/user");



const auth = async(req, res, next) => {
  try{
    let token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, 'thisisthesecret')
    const user = await User.findOne({_id: decode._id, 'tokens.token': token})

    if(!user){
        throw new Error()
    }
    req.token = token
    req.user = user
    next()
}catch(e){
    res.status(401).send("error")
}
}

module.exports = auth;