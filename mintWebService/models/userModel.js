const mongoose = require('mongoose')
const Role = require('./roleModel.js')
const Status = require('./statusModel.js')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    birthDate:{
        type: String,
        required: true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role',
        required: true
    },
    status:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Status',
        required: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: false
    }
},{ collection: 'Users',versionKey: false })

const User = mongoose.model('Users',userSchema)
module.exports = User