const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const errorController = require('../controller/404');
const productController = require('../controller/product');
const isAuth = require('../middleware/isAuth');
const notLogged = require('../middleware/notLogged');


router.get('/', productController.getProductPage);

router.post('/post', isAuth, productController.postAddProduct);

router.get('/post', isAuth, productController.getAddProduct);

router.get('/login', notLogged, userController.getUserLogin);

router.post('/login', notLogged, userController.postUserLogin);

router.get('/logout', isAuth, userController.postUserLogout);

router.get('/signup', notLogged, userController.getUserSignup);

router.post('/signup', notLogged, userController.postUserSignup);

router.get('/product/:productId', productController.getProduct);

router.use(errorController.get404);

module.exports = router;