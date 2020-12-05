const {formatBRL,date} = require("../../lib/utils")

const Product = require("../models/Product")
const File = require("../models/File")

module.exports = {
    async index(req,res){
        let results = await Product.all()
        const products = results.rows

        if(!products) return res.send("Products Not Found")

        async function getImage(productId){
            let results = await Product.files(productId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`)

            return files[0]
        }

        const productsPromise = products.map(async product =>{
            product.img = await getImage(product.id)
            product.oldPrice = formatBRL(product.old_price)
            product.price = formatBRL(product.price)
            return product
        }).filter((product,index) => index > 2 ? false : true) // ? => IF    : => Else

        const lastAdded = await Promise.all(productsPromise)

        return res.render("home/index",{products:lastAdded})
    }
}