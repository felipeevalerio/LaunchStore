const LoadProductService = require("../services/LoadProductService")

module.exports = {
    async index(req,res){
        const allProducts = await LoadProductService.load("products")
        const products = allProducts
            .filter((product,index) => index > 2 ? false : true) // ? => IF    : => Else

        return res.render("home/index",{products})
    }
}