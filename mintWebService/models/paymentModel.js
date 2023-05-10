const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    method:{
        type: String,
        required: true
    }
},{ collection: 'Payments', versionKey: false })

const Payment = mongoose.model('Payments', paymentSchema)

module.exports = Payment