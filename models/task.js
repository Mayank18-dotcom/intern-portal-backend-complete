var mongoose = require("mongoose");
//options is mentor's ID 
var TaskSchema = new mongoose.Schema({
    username: {type : String},
    options:{type : Number},
    taskname:{type: String},
    enddate:{type:String},
    taskdetails:{type: String},
    complete:{type:String,default:"Incomplete"}
});

module.exports = mongoose.model("Task", TaskSchema);

