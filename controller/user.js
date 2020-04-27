const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getUserLogin = (req, res) => {
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    let successMessage = req.flash('success');
    if(successMessage.length > 0) {
        successMessage = successMessage[0];
    } else {
        successMessage = null;
    }
    res.render('auth/login.ejs',{
        pageTitle:'Login',
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: errorMessage,
        successMessage: successMessage
    });
}

exports.postUserLogin = (req, res) => {
    const email= req.body.email;
    const password= req.body.password;
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        req.session.isLoggedIn=true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');

                })
        })
}

exports.getUserSignup = (req, res) => {
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth/signup.ejs', {
        pageTitle:'Signup',
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: errorMessage
    });
}

exports.postUserSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc) {
                req.flash('error', 'Email already exists!!');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    name: 'xyz',
                    email: email,
                    password: hashedPassword,
                    cell: req.body.cell,
                    date_joined: new Date(),
                    college: req.body.college,
                    city: req.body.city,
                    products: []
                });
                return user.save();
            })
            .then(result => {
                req.flash('success', 'Account created, please login.');
                res.redirect('/login');
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};