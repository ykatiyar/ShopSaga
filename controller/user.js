exports.getUserLogin = (req, res) => {
    res.render('auth/login.ejs',{
        pageTitle:'Login',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postUserLogin = (req, res) => {
    req.session.isLoggedIn=true;
    req.session.user = req.user;
    res.redirect('/');
}

exports.getUserSignup = (req, res) => {
    res.render('auth/signup.ejs', {
        pageTitle:'Signup',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};