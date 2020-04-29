let express = require('express');
let app = express();
const path = require('path');
require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./models/user');
const routes = require('./Routes/routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
// cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
// cfg.authToken = process.env.TWILIO_AUTH_TOKEN;

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'session'
})

app.set('view engine','ejs');
app.set('views','views');
app.use(upload.single('image'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:process.env.MONGODB_SECRET, resave: false, saveUninitialized: false, store: store}));

app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.errorMessage = '';
    res.locals.successMessage = '';
    res.locals.otherMessage = '';
    if(req.session.user){
        res.locals.user_id = req.session.user._id;
    }
    next();
})

app.use(routes);

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
