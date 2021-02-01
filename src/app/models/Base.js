const db = require("../../config/db")

function find(filters,table){
    let query = `SELECT * FROM ${table}`

    if(filters){
        Object.keys(filters).map(key =>{
            query += ` ${key}`
            
            Object.keys(filters[key]).map(field =>{
                query += ` ${field} = '${filters[key][field]}'`
            })
        })
    }

    return db.query(query)
}


const Base = {
    init({table}){
        if(!table) throw new Error("Invalid Params")

        this.table = table
        return this
    },
    async find(id){
        const results = await find({WHERE:{id}},this.table)
        return results.rows[0]  
    },
    async findOne(filters){
        const results = await find(filters,this.table)
        return results.rows[0]  
    },
    async findAll(filters){
        const results = await find(filters,this.table)
        return results.rows
    },
    async create(fields){
        try{
            let keys = [],
                values = []

            Object.keys(fields).map(key =>{
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })
            const query = `
            INSERT INTO ${this.table} (${keys.join(",")})
            VALUES(${values.join(",")})
            RETURNING id`
            
            const results = await db.query(query)
            return results.rows[0].id
        }
        catch(err){
            console.error(err)
        }
    },
    update(id,fields){
        try{

            let update = []

            Object.keys(fields).map(key =>{
                const line = `${key} = '${fields[key]}'`
                update.push(line)
            })
            
            let query = `UPDATE ${this.table} SET 
                ${update.join(",")}
                WHERE id = ${id}`

            console.log(query)
            return db.query(query)
        }
        catch(err){
            console.error(err)
        }
    },
    delete(id){
        try{
            return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
        }
        catch(err){
            console.error(err)
        }
    }
}
module.exports  = Base