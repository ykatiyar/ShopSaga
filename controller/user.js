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
                    phone: req.body.cell,
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


exports.checkVerification = function(req, res) {
    let user = {};

    // Load user model
    User.findById(req.user._id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(req.body.code, postVerify);
    });

    // Handle verification res
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account '
                + '- please enter your token again.');
        }

        // Send confirmation text message
        const message = 'You did it! Signup complete :)';
        user.sendMessage(message, function() {
          // show success page
          req.flash('successes', message);
          res.redirect('/');
        }, function(err) {
          req.flash('error', 'You are signed up, but '
              + 'we could not send you a message. Our bad :(');
        });
    }

    // respond with an error
    function die(message) {
        req.flash('error', message);
        res.redirect('back');
    }
};



// Resend a code if it was not received
exports.sendVerification = function(req, res) {
    // Load user model
    User.findById(req.user._id, function(err, user) {
        if (err || !user) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's send them a new code
        user.sendAuthyToken(postSend);
        // res.render('auth/verification', {
        //     pageTitle:'Verification',
        //     isLoggedIn: req.session.isLoggedIn
        // });
    });

    // Handle send code res
    function postSend(err) {
        if (err) {
            return die('There was a problem sending you the code - please '+ 'retry.');
        }
        req.flash('success', 'Code sent!');
        res.redirect('back');
    }

    // respond with an error
    function die(message) {
        req.flash('error', message);
        res.redirect('back');
    }
};


exports.showUser = function(req, res, next) {
    // Load user model
    User.findById(req.params.id, function(err, user) {
        if (err || !user) {
            // 404
            return next();
        }

        res.render('users/show', {
            title: 'Hi there ' + user.fullName + '!',
            user: user,
            // any error
            error: req.flash('error'),
            // any success messages
            successes: req.flash('successes'),
        });
    });
};





exports.getUserProfile = (req, res) => {
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    User.findById(req.params.id)
        .populate('products')
        .then(user => {
            res.render('auth/profile', {
                pageTitle:'Profile',
                isLoggedIn: req.session.isLoggedIn,
                user: user,
                prods: user.products,
                errorMessage: errorMessage
            });
    })    
}