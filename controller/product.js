const Product = require('../models/product');

exports.getProductPage = (req, res) => {
    Product.find()
        .then(products => {
            console.log(products)
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
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const condition = req.body.condition;
    const product = new Product({
        name: name,
        price: price,
        description: description,
        condition: condition,
        category: category,
        userId: req.user
    });     
    product.save()
        .then(result => {
            console.log('Product Created');
            console.log(result)
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res) => {
    const prodID = req.params.productId;
    Product.findById(prodID)
        .populate('userId', 'name email')
        .then(product => {
            res.render('product', {
                product: product,
                pageTitle: product.title
            });
        })
        .catch(err => console.log(err));
};