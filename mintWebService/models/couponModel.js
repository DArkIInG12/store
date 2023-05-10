const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    coupon:{
        type: String,
        required: true
    },
    value:{
        type: String,
        required: true
    }
},{ collection: 'Coupons', versionKey: false })

const Coupon = mongoose.model('Coupons', couponSchema)

module.exports = Coupon