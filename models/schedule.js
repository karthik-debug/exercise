const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    msg:{type:String},
    dt:{type:String},
    isCopied:{type:Boolean,default:false}
});


module.exports = mongoose.model("schedule", scheduleSchema);
