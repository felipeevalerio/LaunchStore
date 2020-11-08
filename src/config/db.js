const {Pool} = require('pg')

module.exports = new Pool({
    user:"postgres",
    password:"Mainthresh9951!",
    host:"localhost",
    port:5432,
    database:"launchstore"
})