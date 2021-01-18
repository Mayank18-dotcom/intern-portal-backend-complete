var mongoose = require("mongoose");
//options is mentor's ID 
var TaskSchema = new mongoose.Schema({
    username: {type : String},
    email:{type : String},
    options:{type : Number},
    taskname:{type: String},
    enddate:{type:String},
    taskdetails:{type: String},
    link:{type:String},
    complete:{type:String,default:"Incomplete"},
    remark:{type:String, default: "NA"}
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;

