const express = require('express');
const router = express.Router();

const product = [];

router.get('/post',function(req,res){
    res.render('add-product.ejs',{pageTitle:'Post Add'});
});
router.get('/login',function(req,res){
    res.render('auth/login.ejs',{pageTitle:'Login'});
});
router.get('/signup',function(req,res){
    res.render('auth/signup.ejs',{pageTitle:'Signup'});
});

router.post('/post',function(req,res){
    console.log(req.body.name);
    product.push({name: req.body.name, price: req.body.price, description: req.body.description});
    res.redirect('/');
});

router.get('/',function(req,res){
    res.render('home.ejs',{prods: product,pageTitle:'ShopSaga'});
});

router.use(function(req,res){
    res.send("<h1> Error 404 Page Not Found </h1>")
});

module.exports = router;