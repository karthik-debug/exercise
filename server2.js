var osutils = require("os-utils");
const { exec } = require("child_process");
const app = require('express')()
const mongoose = require('mongoose')
const schedule = require('./models/schedule')
const schedule2 = require('./models/schedule2')
var scheduler = require('node-schedule');
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
    }
);
console.log("Platform: " + osutils.platform());
console.log("Number of CPUs: " + osutils.cpuCount());
setInterval(()=>{
    osutils.cpuUsage(function(v) {
        if(v>70){
          exec("shutdown -r", (error, stdout, stderr) => {
              if (error) {
                  console.log(`error: ${error.message}`);
                  return;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                  return;
              }
              console.log(`stdout: ${stdout}`);
          });
      
        }
       
      });
      
},2000)
function scheduleJob(data){

     scheduler.scheduleJob(data.dt, function(){
        schedule.findOneAndUpdate({_id:data.id},{$set:{isCopied:true}},{new:true}).then((data)=>{
            console.log(data)
        })
     schedule.findOne({_id:data.id}).then((doc)=>{
      
     var doc2  = new schedule2({"msg":doc.msg})
    doc2.save()
    })
   
  });
    

}
function scheduleFromDataBase(){

    schedule.find({isCopied:false}).then((doc)=>{
        
        for (const iterator of doc) {

            scheduler.scheduleJob(iterator.dt, function(){
               
                schedule.findOneAndUpdate({_id:iterator['_id']},{$set:{isCopied:true}},{new:true}).then((data)=>{
                    console.log(data)
                })
                    var doc2  = new schedule2({"msg":iterator.msg})
                    doc2.save()
                
               
               })         
             }
        })

}
scheduleFromDataBase()

app.post('/save',(req,res)=>{
    try{
    var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    console.log(req.query)
    var time = req.query.time.split(':')
    var error = {}
    if(time.length != 3 ){
        error['time error'] = 'Please send the time in the format HH:MM:SS'
    }

    let qday = -1
    for(let i=0;i<days.length;i++){
        if(req.query.day.toLowerCase() == days[i]){
            console.log(i)
            qday = i
        }
        
    }
    if(time.length>0){
        if((time[0] >24 || time[0]<0)){
            console.log('Coming Inside')
            error['Hour Error'] = 'Please send the time in the format HH:MM:SS ' +  'Hours must be between 00 and 24'

        }
        if(time[0] >59 || time[0]<0){
            error['Minutes Error'] = 'Please send the time in the format HH:MM:SS ' + 'Minutes must be between 00 and 59'

        }
        if(time[0] >59 || time[0]<0){
            error['Secoonds Error'] = 'Please send the time in the format HH:MM:SS ' + 'Seconds must be between 00 and 59'

        }

    }
    if(qday== -1){
        error['day error'] = 'Please send a valid day as ' + days.join()
    }
   if(error['day error'] ||error['Secoonds Error'] ||   error['Hour Error'] || error['Minutes Error'] || error['time error']){
        return   res.send (error)
      }
    
    var date = new Date()
    var day = date.getDay()
    var dt = date.getDate() 
    var diff = qday - day
    if(diff >= 0){
        dt = dt + diff
    console.log(dt)
    var  newDate = new Date().setDate(dt) 
    var d = new Date(newDate)
    
    d.setHours(time[0],time[1],time[2])
    
    var task = new schedule({msg:req.query.msg,dt:d.toString()})
    task.save().then((data)=>{
        scheduleJob(data,data)
    })
    }else{
        dt = dt - diff + 6
        console.log('diff',diff)
        dt = dt + diff
        console.log(dt)
        var  newDate = new Date().setDate(dt) 
        var d = new Date(newDate)
        d.setHours(time[0],time[1],time[2])
    
    var task = new schedule({msg:req.query.msg,dt:d.toString()})
    task.save().then((data)=>{
        scheduleJob(data,data)
    })
        
    }
    
    // console.log(time)
    console.log(d)
    res.send({"Date":d.toString()})
}
catch(e){
    res.send(e)
}
})
app.listen(3001,()=>{
    console.log('Server is listening on port 3001')
})



