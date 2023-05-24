const express = require('express')
const categoryRouter = express.Router()
const Category = require('../models/categoryModel.js')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
categoryRouter.get('/',async (req,res) => {
    const categoryList = await Category.find()

    if(!categoryList){
        res.status(500).json({ success: false })
    }
    //console.log("User: " + req.auth.userEmail + " got a list of categories...")
    res.send(categoryList)
})

categoryRouter.get('/products',async (req,res) => {
    const categoryList = await Category.find().populate('products')

    if(!categoryList){
        res.status(500).json({ success: false })
    }
    //console.log("User: " + req.auth.userEmail + " got a list of categories...")
    res.send(categoryList)
})

/*---------------------------------------- CREATE ----------------------------------------*/ 
categoryRouter.post('/register',async (req,res) => {
    let newCategory = new Category({
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
        products: []
    })

    newCategory = await newCategory.save()

    if(!newCategory) return res.status(400).json({message:'The category has not been created!'})

    res.status(200).json({message: 'The category has been registered!',category: newCategory._id,image: newCategory.image})
})

/*---------------------------------------- DELETE ----------------------------------------*/
categoryRouter.delete('/:id',(req,res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({success: true, message: 'The category has been deleted'})
        }else{
            return res.status(404).json({success: false, message: 'The category has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
categoryRouter.put('/:id', async (req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            description: req.body.description,
            image: req.body.image,
            products:[]
        },{ new: true }
    )
    if(!category) return res.status(400).json({message: 'The category cannot be updated!'})

    res.status(200).json({message: 'The category has been updated!',image: category.image})
})

categoryRouter.put('/addProduct/:id/:idProduct', async (req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            $push:{
                products: req.params.idProduct
            }
        },{ new: true }
    )
    if(!category) return res.status(400).json({message: 'The category cannot be updated!'})

    res.status(200).json({message: 'The product has been added to category!'})
})

categoryRouter.put('/removeProduct/:id/:idProduct', async (req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            $pull:{
                products: req.params.idProduct
            }
        },{ safe: true }
    )
    if(!category) return res.status(400).json({message: 'The category cannot be updated!'})

    res.status(200).json({message: 'The product has been deleted from category! '})
})

module.exports = categoryRouter