const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
                    name: req.body.username,
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
                return sgMail.send({
                    to: email,
                    from: 'shopsaga.mailer@gmail.com',
                    subject: 'Welcome to Shopsaga!!',
                    text: 'Welcome to Shopsaga',
                    html: '<h1>You signed up sucessfully!!</h1>',
                });
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        // console.log(err);
        res.redirect('/');
    });
};





exports.getUserProfile = (req, res, next) => {
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
    let myprofile = false;
    if(req.user && req.user._id.toString() === req.params.id.toString()) {
        myprofile = true;
    }
    User.findById(req.params.id)
        .populate('products')
        .then(user => {
            if(user){
                res.render('auth/profile', {
                    pageTitle:'Profile',
                    isLoggedIn: req.session.isLoggedIn,
                    user: user,
                    prods: user.products,
                    errorMessage: errorMessage,
                    successMessage: successMessage,
                    myprofile: myprofile
                });
            }
            else {
                req.flash('error', "No such account exists!!")
                res.redirect('/');
            }
    })    
}



exports.getUserReset = (req, res, next) => {
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
    res.render('auth/reset-password', {
        pageTitle:'Reset Password',
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: errorMessage,
        successMessage: successMessage,
    });
    
}


exports.postUserReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/resetpass');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    req.flash('error', 'No account with that email found')
                    return res.redirect('/resetpass');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();

            })
            .then(result => {
                res.redirect('/');
                return sgMail.send({
                    to: req.body.email,
                    from: 'shopsaga.mailer@gmail.com',
                    subject: 'Password Reset',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/resetpass/${token}">link</a> to set a new password.</p>
                  `
                });
            })
            .catch(err => {
                console.log(err)
            })
    })
}


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token,
          isLoggedIn: req.session.isLoggedIn,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };



  exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };




















exports.checkVerification = function(req, res) {
    let user = {};
    User.findById(req.user._id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }
        user = doc;
        user.verifyAuthyToken(req.body.code, postVerify);
    });
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        user.verified = true;
        user.save(postSave);
    }

    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account '
                + '- please enter your token again.');
        }

        req.flash('success', 'You did it! Verification complete :)');
        res.redirect('/profile/'+req.user._id);
    }

    function die(message) {
        req.flash('error', message);
        res.redirect('/verify');
    }
};



// Resend a code if it was not received
exports.sendVerification = function(req, res) {
    // Load user model

    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return die('User not found for this ID.');
            }
            if(req.user.verified){
                req.flash('success', 'You are already verified');
                return res.redirect('/profile/'+req.user._id)
            }
    
            // If we find the user, let's send them a new code
            return user.sendAuthyToken(postSend)
        })
        .catch(err => {
            console.log(err);
        })

    // Handle send code res
    function postSend(err) {
        if (err) {
            return die('There was a problem sending you the code - please '+ 'retry.');
        }

        let errorMessage = req.flash('error');
        if(errorMessage.length > 0) {
            errorMessage = errorMessage[0];
        } else {
            errorMessage = null;
        }
        res.render('auth/verification', {
            pageTitle:'Verification',
            isLoggedIn: req.session.isLoggedIn,
            errorMessage: errorMessage
        });
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





