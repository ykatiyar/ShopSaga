const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback =>{
    MongoClient.connect('mongodb+srv://nuclrya:E70CNB3Dt9Nl8VtE@cluster0-osmed.mongodb.net/shop?retryWrites=true&w=majority') // creating connection to mongodb)
    .then(client => {
        console.log('Connected');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;