const express = require('express')
const supplierRouter = express.Router()
const Supplier = require('../models/supplierModel.js')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
supplierRouter.get('/',async (req,res) => {
    const supplierList = await Supplier.find()

    if(!supplierList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of suppliers...")
    res.send(supplierList)
})

/*---------------------------------------- CREATE ----------------------------------------*/ 
supplierRouter.post('/register',async (req,res) => {
    let newSupplier = new Supplier({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    })

    newSupplier = await newSupplier.save()

    if(!newSupplier) return res.status(400).json({message:'The supplier has not been registered!'})

    res.status(200).json({message: 'The supplier has been registered!'})
})

/*---------------------------------------- DELETE ----------------------------------------*/
supplierRouter.delete('/:id',(req,res) => {
    Supplier.findByIdAndRemove(req.params.id).then(supplier => {
        if(supplier){
            return res.status(200).json({success: true, message: 'The supplier has been deleted'})
        }else{
            return res.status(404).json({success: false, message: 'The supplier has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
supplierRouter.put('/:id', async (req,res) => {
    const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        },{ new: true }
    )
    if(!supplier) return res.status(400).json({message: 'The supplier cannot be updated!'})

    res.status(200).json({message: 'The supplier has been updated!'})
})

module.exports = supplierRouter