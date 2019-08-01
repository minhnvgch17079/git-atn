var expressSesstion = require('express-session')
var sess
var express = require('express')
var router = express.Router()
var client = require('../pg')
var {check, validationResult} = require('express-validator')

router.get('/signin', function(req, res) {//client sign in for store
    res.render('store_signin')
})
router.post('/signin', [
    check('txtUsername', 'Please input your user name').not().isEmpty()
        .isLength({max: 20}).withMessage('Length of user name limit by 20 character'),
    check('txtPassword', 'Please input your password').not().isEmpty()
        .isLength({min: 6, max: 21}).withMessage('password must from 6 to 21 character')
], function(req, res, next) {//server process
    sess = req.session
    var q = req.body
    var txtUsername = q.txtUsername
    var txtPassword = q.txtPassword
    var errors = validationResult(req)
    if(errors.isEmpty()) {
        var sql = "SELECT * FROM store_account WHERE u = '"+txtUsername+"' "
        sql += "AND p = '"+txtPassword+"'"
        client.query(sql, function(err, result) {
            if(err) {
                console.log('Can not sign in')
            } else {
                if (result.rows.length == 1) {
                    sess.store = result.rows[0].u                  
                    next()
                } else {
                    res.render('store_signin', {
                        err: errors.array(),
                        input: q,
                        result: 'wrong username or password'
                    })
                }
            }
        })
    } else {
        res.render('store_signin', {
            err: errors.array(),
            input: q
        })
    }
}, function(req, res) {
    res.redirect('../')    
})

module.exports = router