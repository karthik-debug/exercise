const app = require('express')()
const mongoose = require("mongoose");
const agent = require('./models/Agent')
const routes = require('./routes/uploadRoute')
const utilities = require('./routes/searchRoute')
mongoose.connect(
    "mongodb://localhost:27017/test_db",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            throw err;
        }
        console.log("Connected to DB");
    }
);
app.use('/upload',routes)
app.use('/search',utilities)
app.listen(3000,()=>{
  
    console.log('server started on port 3000')
})