const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const {formatBRL} = require('../../lib/utils')
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
        

        if(req.files.length == 0)
            return res.send('Please,select at least one image')


        let results = await Product.create(req.body)
        const productId = results.rows[0].id


        req.files.forEach(files => {
            await File.create({...file,product_id:productId})
        })

        return res.redirect(`/products/${productId}`)

    },
    async edit(req,res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
        if(!product) return res.send("Product Not Found") 

        product.price = formatBRL(product.price)

        results = await Category.all()
        const categories = results.rows

        return res.render('products/edit.njk',{product,categories})
    },
    async put(req,res){
        req.body.price = req.body.price.replace(/\D/g,"")

        if(req.body.old_price != req.body.price){
            const old_product = await Product.find(req.body.id)

            req.body.old_price = old_product.rows[0].price
        }

        await Product.update(req.body)

        return res.rendirect(`/products/${req.body.id}/edit`)
    },
    async delete(req,res){
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}