const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        max: 40
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    }]
},{ collection: 'Category', versionKey: false })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category