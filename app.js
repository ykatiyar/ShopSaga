let express = require('express');
let app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const routes = require('./Routes/routes');
const bodyParser = require('body-parser');

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
    User.findById('5e9572448f1fc03d253e9854')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(routes);

mongoose.connect('mongodb+srv://nuclrya:E70CNB3Dt9Nl8VtE@cluster0-osmed.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if(!user) {
                const user = new User({
                    name: 'Yash',
                    email: 'xyz@gmail.com',
                    cell: '564'
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
