const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema( {
    name: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    condition: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image_url: [{
        url:    {   type: String,
                    required: true
        }
    }],
    college: {
        type: String,
        // required: true
    },
    date_posted: {
        type: Date,
        required: true 
    }
});




module.exports = mongoose.model('Product', productSchema);