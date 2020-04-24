const Product = require('../models/product');

exports.getProductPage = (req, res) => {
    if(req.query.product) {
        const regex = new RegExp(escapeRegex(req.query.product), 'gi');
        let noMatch=false;
        Product.find({
                $or: [
                    {name: regex},
                    {description: regex},
                    {category: regex}
                ]
            }, function(err, allProducts){
            if(err || !allProducts.length)
                noMatch=true;
            res.render("home", {
                prods: allProducts,
                pageHeader: 'Search result for: '+req.query.product,
                pageTitle: req.query.product,
                isLoggedIn: req.session.isLoggedIn,
                noMatch:noMatch
            });
        });
    }
    else if(req.query.category) {
        const category = req.query.category;
        Product.find({'category': category})
            .then(product => {
                res.render('home', {
                    prods: product,
                    pageHeader: 'Category: '+category,
                    pageTitle: category,
                    isLoggedIn: req.session.isLoggedIn
                });
            })
            .catch(err => console.log(err));
    }
    else{
        Product.find()
            .then(products => {
                res.render('home', {
                    prods: products,
                    pageHeader: 'Recently Uploaded',
                    pageTitle: 'ShopSaga',
                    isLoggedIn: req.session.isLoggedIn
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}

exports.getAddProduct = (req, res) => {
    res.render('add-product', {
        pageTitle:'Post Add',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;
        const category = req.body.category;
        const condition = req.body.condition;
        const image_url = result.secure_url;
        const date_posted = new Date();
        const product = new Product({
            name: name,
            price: price,
            description: description,
            condition: condition,
            category: category,
            userId: req.session.user._id,
            image_url: image_url,
            date_posted: date_posted
        });     
        product.save()
            .then(result => {
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            });
        });
}

exports.getProduct = (req, res) => {
    const prodID = req.params.productId;
    Product.findById(prodID)
        .populate('userId')
        .then(product => {
            console.log(product)
            res.render('product', {
                product: product,
                pageTitle: product.title,
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};  
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'nuclrya', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});