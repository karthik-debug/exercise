const mongoose = require("mongoose");

const scheduleSchema2 = new mongoose.Schema({
    msg:{type:String},
    dt:{type:String}
});


module.exports = mongoose.model("schedule2", scheduleSchema2);
