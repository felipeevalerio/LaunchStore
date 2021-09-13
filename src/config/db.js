const {Pool} = require('pg')
require('dotenv').config({ path: require('find-config')('.env') })

module.exports = new Pool({
    host:process.env.DATABASE_HOST,
    database:process.env.DATABASE_DB,
    password:process.env.DATABASE_PASSWORD,
    user:process.env.DATABASE_USER,
    port:process.env.DATABASE_PORT,
    ssl:{
        rejectUnauthorized:false
    }
})