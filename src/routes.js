const express = require("express")
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const ProductController = require('./app/controllers/ProductController')
const homeController = require("./app/controllers/homeController")

routes.get('/',homeController.index)

routes.get('/products/create',ProductController.create)
routes.get('/products/:id',ProductController.show)
routes.get('/products/:id/edit',ProductController.edit)


routes.post('/products',multer.array('photos',6),ProductController.post)
routes.put('/products',multer.array('photos',6),ProductController.put)
routes.delete('/products',ProductController.delete)
//Alias (atalhos)
routes.get("/ads/create",(req,res)=>{
    return res.redirect('/products/create')
})


module.exports = routes //Exportar a constante "Routes"