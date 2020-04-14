const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cell: {
        type: Number,
        required: true
    },
    products: [
        {
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true}
        }        
    ]
});

module.exports = mongoose.model('User', userSchema)
