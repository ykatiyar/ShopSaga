const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const errorController = require('../controller/404');
const productController = require('../controller/product');

router.get('/', productController.getProductPage);

router.post('/post', productController.postAddProduct);

router.get('/post', productController.getAddProduct);

router.get('/login', userController.getUserLogin);

router.post('/login', userController.postUserLogin);

router.get('/logout', userController.postUserLogout);

router.get('/signup', userController.getUserSignup);

router.get('/product/:productId', productController.getProduct);

router.get('/category/:category', productController.getCategoryPage);

router.use(errorController.get404);

module.exports = router;