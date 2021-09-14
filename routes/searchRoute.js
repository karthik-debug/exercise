const router = require("express").Router()
const policy = require('../models/PolicyInfo')

const User = require("../models/User");
const ctg = require("../models/LOB");
const cmpn = require('../models/Carrier')
const uAct = require('../models/UserAccount')
router.get('/single',async (req,res)=>{
    console.log(req.query.key)
  await  User.findOne({firstName:req.query.key}).then((data)=>{
        
    
        if(data){

            policy.find({userRef:data['_id']}).populate('userRef').populate('agentRef').populate('coompanyRef').populate('categoryRef').populate('userAccnt').then((data)=>{
                res.send(data)
            })
           
        } else{
            res.send("No data Found")
        }
    })
})
router.get('/allData',async (req,res)=>{
    policy.aggregate([{
        $group:{
           _id: "$userRef", policyNumbers:{$push: {policy_number:"$policy_number", _id:"$_id" }},
           policy_count:{$sum:1}

    }},{$lookup:{
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as:"userinfo"
    }

}]).then((data)=>{
    if(data.length>0){
        res.send(data)
    }else{
        res.send("No data Found")
    }
        
    })
  })
module.exports = router