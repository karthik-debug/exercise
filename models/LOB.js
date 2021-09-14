const mongoose = require("mongoose");
const policyCtgSchema = new mongoose.Schema({
    categoryName:{type:String}
});
module.exports = mongoose.model("categorynames", policyCtgSchema);
