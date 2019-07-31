var {Pool, Client} = require('pg')
var client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'atn',
    password: '2108',
    port: 5433
})
if(client.connect()) {
    console.log('Connect to postgreSQL successfully...')
} else {
    console.log('Faild to connect to postgreSQL...')
}
module.exports = client