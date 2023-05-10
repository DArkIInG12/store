const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    id: Number,
    role:{
        type: String,
        required: true,
        max: 20
    }
},{ collection: 'Role', versionKey: false })

const Role = mongoose.model('Role',roleSchema)

module.exports = Role