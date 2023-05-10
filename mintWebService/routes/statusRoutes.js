const express = require('express')
const statusRouter = express.Router()
const Status = require('../models/statusModel.js')

statusRouter.get('/',async (req,res) => {
    const statusList = await Status.find()

    if(!statusList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of status...")
    res.send(statusList)
})

module.exports = statusRouter