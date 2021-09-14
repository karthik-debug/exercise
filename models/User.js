const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:String,
    dateofBirth:Date,
    address:String,
    phNumber:String,
    state:String,
    zipCode:String,
    email:String,
    userType:String
});


module.exports = mongoose.model("user", userSchema);
