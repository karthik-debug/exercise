const router = require("express").Router()
const fs = require('fs')
const path = require('path')
const csvUpload = require('../services/strorageService')
const dirPath = path.join(__dirname, '../uploads/');
const {Worker} = require("worker_threads");
router.post('/csv',csvUpload.single('file'),async (req,res)=>{
  let msg = {}
    console.log('saved file to uploads folder as '+ req.file.filename)
    if(req.file){
  const worker = new Worker(path.join(__dirname,"../services/readworker.js"), {workerData: {filename: req.file.filename}});
      msg['Thread started at']  =  new Date()
  worker.on("message", result => {
    msg['No of Policies Saved'] = result
});
worker.on('error', (code) => {
  res.send(code)
})
worker.on('exit', (code) => {
  console.log('exit code',code)
  msg['Thread stopped at'] = new Date()
  res.send(msg)
  if (code !== 0)
  res.send('some thing went wrong! Please try again')
});
    }
})

module.exports = router