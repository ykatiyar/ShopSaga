const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getUserLogin = (req, res) => {
    res.render('auth/login.ejs',{
        pageTitle:'Login',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postUserLogin = (req, res) => {
    const email= req.body.email;
    const password= req.body.password;
    User.findOne({email: email})
        .then(user => {
            if(!user) {
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
                    res.redirect('/login');

                })
        })
}

exports.getUserSignup = (req, res) => {
    res.render('auth/signup.ejs', {
        pageTitle:'Signup',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postUserSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc) {
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
                console.log(result);
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