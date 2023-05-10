const express = require('express')
const roleRouter = express.Router()
const Role = require('../models/roleModel.js')

roleRouter.get('/',async (req,res) => {
    const roleList = await Role.find()

    if(!roleList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of roles...")
    res.send(roleList)
})

module.exports = roleRouter