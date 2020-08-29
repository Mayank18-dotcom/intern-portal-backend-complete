var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    username: {type: String, unique: true,require: true},
    password: {type: String ,require: true},
    regno: {type: Number,unique: true, require: true},
    email: {type: String, require:true},
    tokens: [{
        token :{
            type: String,
            require: true
        }
    }]
});

//Token generation
AdminSchema.methods.generateauthtoken = async function() {
    const admin = this
    const token = jwt.sign( {_id: admin._id.toString() }, 'thisisthesecret')

    admin.tokens = admin.tokens.concat({ token })

    await admin.save();

    return token;
}

// verifying our admin
AdminSchema.statics.findbycredentials = async (username, password) => {
    const admin = await Admin.findOne({username})
    if(!admin){
        throw new Error("unable to login");

    }

    const ismatch = await bycrypt.compare(password, admin.password)

    if(!ismatch){
        throw new Error("unable to login");
    }

    return admin;
}

//Haash the password
AdminSchema.pre('save', async function(next){
    const admin = this

    if (admin.isModified("password")){
    
    admin.password = await bycrypt.hash(admin.password, 8);

    }

    next()
})

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;