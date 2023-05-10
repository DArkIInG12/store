const express = require('express')
const authJwt = require('./auth/jwt.js')
const app = express()
const port = 3000
require('dotenv').config()
app.use(express.json())
app.use(authJwt())
const connection = require('./dbConnection.js')
const api = process.env.API_ROUTE;

//RUTAS
const userRoutes = require('./routes/userRoutes.js')
app.use(`${api}/users`,userRoutes)
const roleRoutes = require('./routes/roleRoutes.js')
app.use(`${api}/roles`,roleRoutes)
const statusRoutes = require('./routes/statusRoutes.js')
app.use(`${api}/status`,statusRoutes)
const productRoutes = require('./routes/productRoutes.js')
app.use(`${api}/products`,productRoutes)
const categoryRoutes = require('./routes/categoryRoutes.js')
app.use(`${api}/categories`,categoryRoutes)
const supplierRoutes = require('./routes/supplierRoutes.js')
app.use(`${api}/suppliers`,supplierRoutes)
const couponRoutes = require('./routes/couponRoutes.js')
app.use(`${api}/coupons`,couponRoutes)
const paymentRoutes = require('./routes/paymentRoutes.js')
app.use(`${api}/payments`,paymentRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    })