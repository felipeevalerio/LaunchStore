const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    async create(req,res){
        //Pegar categorias
        // Category.all().then((results)=>{
            
        //     const categories = results.rows
        //     return res.render("products/create.njk",{categories})

        // }).catch((err)=>{
        //     throw new Error(err) 
        // })
        const results = await Category.all()
        const categories = results.rows
        
        return res.render('products/create',{categories})
    },
    async post(req,res){
        
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        return res.redirect(`/products/${productId}`)

    },
    async edit(req,res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
        if(!product) return res.send("Product Not Found") 

        results = await Category.all()
        const categories = results.rows

        return res.render('products/edit.njk',{product,categories})
    }
}