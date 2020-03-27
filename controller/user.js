exports.getUserLogin = (req, res) => {
    res.render('auth/login.ejs',{
        pageTitle:'Login'
    });
}

exports.getUserSignup = (req, res) => {
    res.render('auth/signup.ejs', {
        pageTitle:'Signup'
    });
}