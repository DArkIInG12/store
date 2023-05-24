const express = require('express')
const paymentRouter = express.Router()
const Payment = require('../models/paymentModel.js')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
paymentRouter.get('/',async (req,res) => {
    const paymentList = await Payment.find()

    if(!paymentList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of payments...")
    res.send(paymentList)
})

/*---------------------------------------- CREATE ----------------------------------------*/ 
paymentRouter.post('/register',async (req,res) => {
    let newPayment = new Payment({
        method: req.body.method
    })

    newPayment = await newPayment.save()

    if(!newPayment) return res.status(400).json({message:'The payment has not been created!'})

    res.status(200).json({message: 'The payment has been registered!', method:newPayment._id})
})

/*---------------------------------------- DELETE ----------------------------------------*/
paymentRouter.delete('/:id',(req,res) => {
    Payment.findByIdAndRemove(req.params.id).then(payment => {
        if(payment){
            return res.status(200).json({success: true, message: 'The payment has been deleted'})
        }else{
            return res.status(404).json({success: false, message: 'The payment has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
paymentRouter.put('/:id', async (req,res) => {
    const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        {
            method: req.body.method
        },{ new: true }
    )
    if(!payment) return res.status(400).json({message: 'The payment cannot be updated!'})

    res.status(200).json({message: 'The payment has been updated!'})
})

module.exports = paymentRouter