let express = require('express');
let app = express();
const path = require('path');
require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./models/user');
const routes = require('./Routes/routes');
const bodyParser = require('body-parser');
const session = require('express-session');
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

app.use((req, res, next) => {
    if(req.session.user) {
        return next();
    }
    User.findById('5e95b880f08ba35513c087dd')
        .then(user => {
            req.session.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(routes);

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if(!user) {
                const user = new User({
                    name: 'Aditya Bhati',
                    email: 'xyz@gmail.com',
                    cell: '987654321',
                    date_joined: new Date(),
                    college: 'IIIT Allahabad',
                    city: 'Prayagraj',
                    state: 'Uttar Pradesh'
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
