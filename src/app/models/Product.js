const db = require("../../config/db")
const Base = require("./Base")

Base.init({table:"products"})


module.exports = {
    ...Base,

    async files(id){
        const results = await db.query(`SELECT * FROM FILES WHERE product_id = $1`,[id])
        return results.rows
    },
    
    async search(params){
        const {filter,category} = params

        let query = "",
            filterQuery = `WHERE`

        if(category){
            filterQuery += ` 
                products.category_id = ${category} 
                AND
            ` 
        }   

        filterQuery += `
            products.name ILIKE '%${filter}%'
            OR products.description ILIKE '%${filter}%'
        `


        query = `
            SELECT products.* ,categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `

        const results = await db.query(query)
        return results.rows
    }
}