let express = require('express');
let app = express();
const path = require('path');
const mongoConnect = require('./database/database').mongoConnect;

const adminRoutes = require('./Routes/routes');
const bodyParser = require('body-parser');

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(adminRoutes);

mongoConnect(() => {
    app.listen(3000);
    console.log('Server Started at 3000!!');
})
