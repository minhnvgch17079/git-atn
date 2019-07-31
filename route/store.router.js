var expressSesstion = require('express-session')
var sess
var express = require('express')
var router = express.Router()
var client = require('../pg')


router.get('/signin', function(req, res) {//client sign in for store
    res.render('store_signin')
})
router.post('/signin', function(req, res, next) {//server process
    sess = req.session
    var q = req.body
    var sql = "SELECT * FROM store_account WHERE u = '"+q.txtUsername+"' "
    sql += "AND p = '"+q.txtPassword+"'"
    client.query(sql, function(err, res) {
        if(err) {
            console.log('Can not sign in')
        } else {
            if (res.rows.length == 1) {
                console.log('Login success')
                sess.store = res.rows[0].u
                next()
            } else {
                console.log('User name or password wrong')
            }
        }
    })
}, function(req, res) {
    res.redirect('../')
})

module.exports = router