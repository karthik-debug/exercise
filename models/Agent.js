const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
    agentName:{type:String}
});


module.exports = mongoose.model("agent", agentSchema);
