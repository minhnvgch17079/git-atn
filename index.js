//out side setup
var expressSesstion = require('express-session')
const { check, validationResult } = require('express-validator');
var client = require('./pg')

//inside setup
var express = require('express')
var app = express()
var port = 3000
app.listen(port, function(req, res) {
    console.log('App running at port ' + port + '....')
})
var store = require('./route/store.router')
var sess

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('trust proxy', 1)
app.use(expressSesstion({
    name: 'MinMin',
    secret: 'Matmangunguoi',
    cookie: {
        maxAge: 60000
    }
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/store', store)


app.get('/', function(req, res) {//home page
    sess = req.session
    if(sess.store) {
        res.render('home', {
            store: sess.store
        })
    } else {
        if(sess.user) {
            res.render('home', {
                user: sess.user
            })
        }
        else {
            res.render('home')
        }
    }
})

app.get('/signin', function(req, res) {
    res.render('signin')
})
app.post('/signin', function(req, res, next) {
    sess = req.session
    var q = req.body
    var sql = "SELECT * FROM customer WHERE user_name = '"+q.txtUsername+"' "
    sql += "AND password = '"+q.txtPassword+"'"
    client.query(sql, function(err, res) {
        if(err) {
            console.log('Can not sign in')
        } else {
            if (res.rows.length == 1) {
                console.log('Login success')
                sess.user = res.rows[0].full_name
                next()
            } else {
                console.log('User name or password wrong')
            }
        }
    })
}, function(req,res) {
    res.redirect('/')
})

app.get('/register', function(req, res) {//client register
    res.render('register')
})
app.post('/register', [
    check('txtName', 'Please input your name').not().isEmpty()
        .isLength({min: 5, max: 50}).withMessage('Length of your name just from 5 to 50').escape(),
    check('txtPhone', 'Wrong format of phone number').isNumeric()
        .isLength({min:10, max:10}).withMessage('Not a phone number, please input again'),
    check('txtAddress', 'Please input address').not().isEmpty()
        .isLength({max: 100}).withMessage('Address is litmit by 100 character').escape(),
    check('txtUsername', 'Please input user name').not().isEmpty()
        .isLength({max: 20}).withMessage('user name limit by 20 character').escape(),
    check('txtPassword', 'Please enter password').not().isEmpty()
        .isLength({min: 6, max: 21}).withMessage('Length of password must from 6 to 21').escape(),
    check('txtEmail', 'wrong email, please input again').isEmail()
        .isLength({max: 50}).withMessage('Length og email limit by 50 character')
], function(req, res) {//server process 
    var q = req.body
    var txtName = q.txtName
    var txtPhone = q.txtPhone
    var txtAddress = q.txtAddress
    var txtUsername =q.txtUsername
    var txtPassword = q.txtPassword
    var txtEmail = q.txtEmail
    var errors = validationResult(req)
    if(errors.isEmpty()) {
        var sql = 'INSERT INTO customer(full_name, phone, address, user_name, password, email) VALUES '
        sql += "('"+txtName+"', '"+txtPhone+"', '"+txtAddress+"', '"+txtUsername+"', '"+txtPassword+"', '"+txtEmail+"')"
        client.query(sql, function(err, res) {
            if(err) {
                console.log('Can not register')
                console.log(sql)
            } else {
                console.log('Register Success')
            }
        })
    } else {
        res.render('register', {
            err: errors.array(),
            input: q
        })
    }

    
})

app.get('/test', function(req, res) {
    res.render('test')
})
app.post('/test', [
    check('phone', 'Password must have length more than 5')
        .isLength({min:10, max:10}).withMessage('not phone')
        .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password'),
    check('email',' Empty').not().isEmpty().isEmail().withMessage('not email')
], function(req, res) {
    var errors = validationResult(req)
    if(errors.isEmpty()) {
        console.log('no error')
    }
    else {
        console.log(errors)
    }
    var phone = req.body.phone
    var email = req.body.email
    console.log(phone + email)
})


app.get('/logout',function(req,res){
	req.session.destroy((err) => {
    err ? console.log(err) :	res.redirect('/')
	})
});









