const mongoose = require('mongoose')
const category = require('./categoryModel.js')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size:{
        type: String,
        required: false
    },
    price:{
        type: Number,
        required: true
    },
    inStock:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    category:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: false
    }
},{ collection: 'Products',versionKey: false })

const Product = mongoose.model('Products',productSchema)
module.exports = Product