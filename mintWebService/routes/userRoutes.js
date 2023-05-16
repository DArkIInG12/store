const express = require('express')
const userRouter = express.Router()
const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/*---------------------------------------- CRUD ----------------------------------------*/ 

/*---------------------------------------- READ ----------------------------------------*/ 
userRouter.get('/',async (req,res) => {
    const userList = await User.find().populate('role','role -_id').populate('status','status -_id')

    if(!userList){
        res.status(500).json({ success: false })
    }
    console.log("User: " + req.auth.userEmail + " got a list of users...")
    res.send(userList)
})

userRouter.get('/workers',async (req,res) => {
    const userList = await User.find({role:'6429b9206d8b820d040f7fe0'}).select('-phone -birthDate -passwordHash').populate('role','role -_id').populate('status','status -_id')

    if(!userList){
        res.status(500).json({ success: false })
    }
    res.send(userList)
})

userRouter.get('/workers/:id',async (req,res) => {
    const userList = await User.find({_id:req.params.id}).select('-phone -birthDate -passwordHash').populate('role','role -_id').populate('status','status -_id')

    if(!userList){
        res.status(500).json({ success: false })
    }
    res.send(userList)
})
/*---------------------------------------- CREATE ----------------------------------------*/ 
userRouter.post('/register',async (req,res) => {
    let newUser = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        birthDate: req.body.birthDate,
        role: req.body.role,
        status: req.body.status,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        cart: []
    })

    newUser = await newUser.save()

    if(!newUser) return res.status(400).json({message:'The user has not been created!'})

    res.status(200).json({message: 'The user has been registered!'})
})

/*---------------------------------------- DELETE ----------------------------------------*/
userRouter.delete('/:id',(req,res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user){
            return res.status(200).json({success: true, message: 'The user has been deleted'})
        }else{
            return res.status(404).json({success: false, message: 'The user has not been found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

/*---------------------------------------- UPDATE ----------------------------------------*/
userRouter.put('/:id', async (req,res) => {
    const userExist = await User.findById(req.params.id)
    let newPassword
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    }else{
        newPassword = userExist.passwordHash
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            birthDate: req.body.birthDate,
            role: req.body.role,
            status: req.body.status,
            passwordHash: newPassword,
        },{ new: true }
    )
    if(!user) return res.status(400).json({message: 'The user cannot be updated!'})

    res.status(200).json({message: 'The user has been updated!'})
})

userRouter.put('/addProduct/:idUser/:idProduct', async (req,res) => {
    const user = await User.findByIdAndUpdate(
        req.params.idUser,
        {
            $push:{
                cart: req.params.idProduct
            }
        },{ new: true }
    )
    if(!user) return res.status(400).json({message: 'The product has not been added to cart!'})

    res.status(200).json({message: 'The product has been added to your cart!'})
})

/*---------------------------------------- OTHER ----------------------------------------*/

userRouter.post('/login',async (req,res) => {
    const user = await User.findOne({email: req.body.email}).populate('role','role -_id').populate('status','status -_id')
    const secret = process.env.SECRET;

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }
    
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign({
            userId: user._id,
            userEmail: user.email,
            isAdmin: user.isAdmin
        },secret, {expiresIn: '5m'})

        res.status(200).send({user: user.email,role:user.role,status:user.status, token})
    }else{
        res.status(400).json({message:'Password is wrong!'})
    }
})

module.exports = userRouter