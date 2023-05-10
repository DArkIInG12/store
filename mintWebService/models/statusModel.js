const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
    id: Number,
    status:{
        type: String,
        required: true,
        max: 20
    }
},{ collection: 'Status', versionKey: false })

const Status = mongoose.model('Status', statusSchema)

module.exports = Status