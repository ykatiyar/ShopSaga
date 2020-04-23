let express = require('express');
let app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const routes = require('./Routes/routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI="mongodb+srv://nuclrya:E70CNB3Dt9Nl8VtE@cluster0-osmed.mongodb.net/shop?retryWrites=true&w=majority";

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
})

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:'this_must_be_a_very_long_string', resave: false, saveUninitialized: false, store: store}));

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

app.use(routes);

mongoose.connect(MONGODB_URI)
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
