const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema({
    comapanyName:{type:String}
});


module.exports = mongoose.model("carriers", carrierSchema);
