const express = require('express')
const productRouter = express.Router()
const Product = require('../models/productModel.js')
const Category = require('../models/categoryModel.js')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
productRouter.get('/',async (req,res) => {
    const productList = await Product.find().populate('category','category -_id')

    if(!productList){
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

productRouter.get('/product/:id',async (req,res) => {
    const product = await Product.find({_id:req.params.id}).populate('category','category -_id')

    if(!product){
        res.status(500).json({ success: false })
    }
    res.send(product)
})

/*---------------------------------------- CREATE ----------------------------------------*/ 
productRouter.post('/register',async (req,res) => {
    let newProduct = new Product({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        color: req.body.color,
        size: req.body.size,
        inStock: req.body.inStock,
        category: req.body.category,
        image: req.body.image
    })

    newProduct = await newProduct.save()

    if(!newProduct) return res.status(400).json({message:'The product has not been created!'})

    const category = await Category.findById(newProduct.category)

    res.status(200).json({message: 'The product has been registered!',product: newProduct._id,image: newProduct.image,nCategory:category.category})
})

/*---------------------------------------- DELETE ----------------------------------------*/
productRouter.delete('/:id',(req,res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product){
            return res.status(200).json({success: true, message: 'The product has been deleted', category: product.category})
        }else{
            return res.status(404).json({success: false, message: 'The product has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
productRouter.put('/:id', async (req,res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            color: req.body.color,
            size: req.body.size,
            inStock: req.body.inStock,
            category: req.body.category,
            image: req.body.image
        },{ new: true }
    )
    if(!product) return res.status(400).json({message: 'The product cannot be updated!'})

    const category = await Category.findById(product.category)

    res.status(200).json({message: 'The product has been updated!',image: product.image,nCategory: category.category})
})

module.exports = productRouter

//AÑADIR MARCA A PRODUCTOS