const Product = require('../models/product');

exports.getProductPage = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('home', {
                prods: products,
                pageTitle: 'ShopSaga'
            })
        })
        .catch(err => {
            console.log(err);
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