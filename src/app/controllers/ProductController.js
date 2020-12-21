const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const {formatBRL,date} = require('../../lib/utils')
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

        req.body.user_id = req.session.userId
        let results = await Product.create(req.body)
        const productId = results.rows[0].id


        const filesPromise = req.files.map(files => {
            File.create({...files,product_id:productId})
        })

        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}`)

    },
    async edit(req,res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
        if(!product) return res.send("Product Not Found") 

        product.price = formatBRL(product.price)

        results = await Category.all()
        const categories = results.rows

        results = await Product.files(product.id)
        
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))


        return res.render('products/edit.njk',{product,categories,files})
    },
    async put(req,res){
        
        
        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex,1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }
        
        if(req.files.length != 0){
            const newFiles = req.files.map(file => File.create({...file,product_id:req.body.id}))

            await Promise.all(newFiles)
        }
        
        
        req.body.price = req.body.price.replace(/\D/g,"")

        if(req.body.old_price != req.body.price){
            const old_product = await Product.find(req.body.id) 

            req.body.old_price = old_product.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    },
    async delete(req,res){
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    },
    async show(req,res){

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Product Not Found")

        const {day,hour,minutes,month} = date(product.updated_at)

        product.published = {
            day:`${day}/${month}`,
            hour:`${hour}h${minutes}`,
        }

        product.old_price = formatBRL(product.old_price)
        product.price = formatBRL(product.price)

        results = await Product.files(product.id)
        const files = results.rows.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))



        res.render('products/show',{product,files})
    }
}