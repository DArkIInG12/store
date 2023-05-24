const express = require('express')
const couponRouter = express.Router()
const Coupon = require('../models/couponModel.js')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
couponRouter.get('/',async (req,res) => {
    const couponList = await Coupon.find()

    if(!couponList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of coupons...")
    res.send(couponList)
})

/*---------------------------------------- CREATE ----------------------------------------*/ 
couponRouter.post('/register',async (req,res) => {
    let newCoupon = new Coupon({
        coupon: req.body.coupon,
        value: req.body.value
    })

    newCoupon = await newCoupon.save()

    if(!newCoupon) return res.status(400).json({message:'The coupon has not been created!'})

    res.status(200).json({message: 'The coupon has been registered!',coupon: newCoupon._id})
})

/*---------------------------------------- DELETE ----------------------------------------*/
couponRouter.delete('/:id',(req,res) => {
    Coupon.findByIdAndRemove(req.params.id).then(coupon => {
        if(coupon){
            return res.status(200).json({success: true, message: 'The coupon has been deleted'})
        }else{
            return res.status(404).json({success: false, message: 'The coupon has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
couponRouter.put('/:id', async (req,res) => {
    const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        {
            coupon: req.body.coupon,
            value: req.body.value
        },{ new: true }
    )
    if(!coupon) return res.status(400).json({message: 'The coupon cannot be updated!'})

    res.status(200).json({message: 'The coupon has been updated!'})
})

module.exports = couponRouter