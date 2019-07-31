//setup
var expressSesstion = require('express-session')
var {check, validationResult} = require('express-validator')

var express = require('express')
var app = express()
var port = 3000
var sess
var client = require('./pg')
var store = require('./route/store.router')


app.listen(port, function(req, res) {
    console.log('App running at port ' + port + '....')
})

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

//end setup
app.use('/store', store)
app.get('/', function(req, res) {//home page
    sess = req.session
    
    if(sess.store) {
        res.render('store', {
            session: sess.store
        })
    } else {
        if(sess.user) {
            res.render('user', {
                session: sess.user
            })
        }
        else {
            res.render('home')
        }
    }
})

app.get('/signin', function(req, res) {//client sign in
    res.render('signin')
})
app.post('/signin', function(req, res, next) {//server process
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
app.post('/register', function(req, res) {//server process 
    check('req.body.txtPassword').isLength({min: 5})
    check('req.body.txtEmail').isEmail()
    var a = check()
    console.log(a)
    var errors = validationResult(req)
    if(errors.isEmpty()) {
        console.log('No error')
    } else {
        console.log('Errors ' + errors)
    }

    /* var q = req.body
    var sql = 'INSERT INTO customer(full_name, phone, address, user_name, password, email) VALUES '
    sql += "('"+q.txtName+"', '"+q.txtPhone+"', '"+q.txtAddress+"', '"+q.txtUsername+"', '"+q.txtPassword+"', '"+q.txtEmail+"')"
    client.query(sql, function(err, res) {
        if(err) {
            console.log('Can not register')
        } else {
            console.log('Register Success')
        }
    }) */
})

app.get('/logout',function(req,res){
	req.session.destroy((err) => {
    err ? console.log(err) :	res.redirect('/')
	})
});









