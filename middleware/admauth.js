const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { findOne } = require("../models/admin");



const admauth = async(req, res, next) => {
    try{
        let token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'thisisthesecret')
        const admin = await Admin.findOne({_id: decode._id, 'tokens.token': token})

        if(!admin){
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    }catch(e){
        res.status(401).send("error")
    }
}

module.exports = admauth;