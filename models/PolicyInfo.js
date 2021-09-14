const mongoose = require("mongoose");
const {Schema} = mongoose

const policyInfoSchema = new mongoose.Schema({
    policy_number:String,
    policy_start_date:Date,
    policy_end_date:Date,
    userAccnt:{type:Schema.Types.ObjectId,ref:"userAccount"},
    userRef:{type:Schema.Types.ObjectId,ref:"user"},
    agentRef:{type:Schema.Types.ObjectId,ref:"agent"},
    coompanyRef:{type:Schema.Types.ObjectId,ref:"carriers"},
    categoryRef:{type:Schema.Types.ObjectId,ref:"categorynames"},
});


module.exports = mongoose.model("policyInfo", policyInfoSchema);
