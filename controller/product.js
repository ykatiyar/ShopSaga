const Product = require('../models/product');

exports.getProductPage = (req, res) => {
    res.render('home.ejs', {
        prods: Product.fetchAll(),
        pageTitle:'ShopSaga'
    });
}

exports.getAddProduct = (req, res) => {
    res.render('add-product', {
        pageTitle:'Post Add'
    });
}

exports.postAddProduct = (req, res) => {
    console.log(req.body.name);
    const product = new Product(req.body);
    product.save();
    res.redirect('/');
}