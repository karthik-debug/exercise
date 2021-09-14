const { parentPort, workerData } = require("worker_threads");
const fs = require('fs')
const parse = require('csv-parse');
const path = require('path');
const dirPath = path.join(__dirname, '../uploads/');
const userAccount = require('../models/UserAccount')
const agent = require('../models/Agent')
const categorynames = require('../models/LOB')
const policy = require('../models/PolicyInfo')
const mongoose = require("mongoose");
const User = require("../models/User");
const companyName = require('../models/Carrier')
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
parentPort.postMessage(read(workerData.filename))
function read(file) {
    agents = new Set()
    users = []
    companyNames = new Set()
    accounts = []
    categories = new Set()
    rows = []
    fs.createReadStream(dirPath + file)
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', async (data) => {
            var user = {}
            var account = {}
            rows.push(data)
            companyNames.add(data['company_name'])
            agents.add(data['agent'])
            categories.add(data['category_name'])
            account['accountName'] = data['account_name']
            accounts.push(account)
            users.push(user)
        })
        .on('end', async () => {
            agentsArray = [...agents]
            cats = [...categories]


            for (let i = 0; i < agentsArray.length; i++) {
                try {
                    let ag = new agent({ agentName: agentsArray[i] })
                    ag.save()
                }
                catch (e) {

                }
            }
            try {
                userAccount.insertMany(accounts)
            } catch (e) {
                console.log(e)
            }
            getData(rows, cats, companyNames, file, agents.length)
            delete rows
            delete agentsArray
            delete agents
            delete companyNames
            delete accounts
            delete categories


        })

    return true

}
async function getData(policyData, cats, companyNames, file, len) {
    try {
        let ctgs = []
        let companyNames1 = []
        for (const iterator of cats) {
            ctgs.push({ 'categoryName': iterator })
        }
        for (const iterator of companyNames) {
            companyNames1.push({ 'comapanyName': iterator })
        }
        await companyName.insertMany(companyNames1)
        await categorynames.insertMany(ctgs)
        let agentdata = await agent.find({})
        for (const iterator of policyData) {
            iterator['agentRef'] = (agentdata.filter((agent) => { return agent.agentName == iterator['agent'] }))[0]['_id']
            var user = {}
            user['firstName'] = iterator['firstname']
            user['dateofBirth'] = iterator['dob']
            user['address'] = iterator['address']
            user['phNumber'] = iterator['phone']
            user['zipCode'] = iterator['zip']
            user['email'] = iterator['email']
            user['userType'] = iterator['userType']
            const user1 = new User(user)
            await User.findOne({ email: iterator['email'] }).then(async (data) => {
                if (data) {
                    iterator['userRef'] = data['_id']
                } else {
                    await user1.save().then((data) => {
                        iterator['userRef'] = data['_id']
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            })

            await categorynames.findOne({ 'categoryName': iterator['category_name'] }).then((data) => {
                if (data) {
                    iterator['categoryRef'] = data['_id']
                }
            })
            await companyName.findOne({ 'comapanyName': iterator['company_name'] }).then((data) => {
                if (data) {
                    iterator['coompanyRef'] = data['_id']
                }
            })
            await userAccount.findOne({ 'accountName': iterator['account_name'] }).then((data) => {
                if (data) {
                    iterator['userAccnt'] = data['_id']
                }
            })
        }
        await policy.insertMany(policyData)
        fs.unlink(dirPath + file, (err => {
            if (err) console.log(err);
            else {
                console.log("\nDeleted file " + file + ' from uploads folder');

            }
        }));
        parentPort.postMessage(policyData.length)
        mongoose.disconnect()
    }
    catch (e) {
        console.log(e)
    }
}