const express = require("express")
const ProductController = require('./app/controllers/ProductController')
const routes = express.Router()

routes.get('/',(req,res)=>{
    return res.render('layout.njk')
})

routes.get('/products/create',ProductController.create)
routes.get('/products/:id/edit',ProductController.edit)
routes.post('/products',ProductController.post)

//Alias (atalhos)
routes.get("/ads/create",(req,res)=>{
    return res.redirect('/products/create')
})


module.exports = routes //Exportar a constante "Routes"