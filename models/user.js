const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    cell: {
        type: Number,
        required: true
    },
    date_joined: {
        type: Date,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    }]
});

module.exports = mongoose.model('User', userSchema)
