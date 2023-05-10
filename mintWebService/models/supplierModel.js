const mongoose = require('mongoose')

const supplierSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
},{ collection: 'Suppliers', versionKey: false })

const Supplier = mongoose.model('Suppliers',supplierSchema)

module.exports = Supplier