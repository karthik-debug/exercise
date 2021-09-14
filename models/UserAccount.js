const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema({
    accountName:String
});


module.exports = mongoose.model("userAccount", userAccountSchema);
