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
    }
});

module.exports = mongoose.model('Product', productSchema);


// const getDb = require('../database/database').getDb;

// class Product {
//     constructor(t) {
//         this.name = t.name;
//         this.price = t.price;
//         this.description = t.description;
//         this.category = t.category;
//         this.condition = t.condition;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('products')
//             .insertOne(this)
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }
// module.exports = Product;