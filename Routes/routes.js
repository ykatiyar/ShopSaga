const express = require('express');
const router = express.Router();

const product = [];

router.get('/post',function(req,res){
    res.send("<html><head><title>Item Page </title></head><body><form action='/post' method='POST'><input type='text' name='list'><button type='submit'>Submit</button></form></body></html>")
});

router.post('/post',function(req,res){
    console.log(req.body.list);
    product.push({name: req.body.list});
    res.redirect('/');
});

router.get('/',function(req,res){
    res.render('home.ejs',{prods: product,pageTitle:'ShopSaga'});
});

router.use(function(req,res){
    res.send("<h1> Error 404 Page Not Found </h1>")
});

module.exports = router;