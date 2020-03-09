const mongodb = require('mongodb');   // requiring mongodb driver
const MongoClient = mongodb.MongoClient;  //extracting MongoClient constructor

let _db;

const mongoConnect = callback =>{
    MongoClient.connect('mongodb://nucleya:sbbc6NGFsLlQUMUS@cluster0-shard-00-00-xvb8k.mongodb.net:27017,cluster0-shard-00-01-xvb8k.mongodb.net:27017,cluster0-shard-00-02-xvb8k.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin') // creating connection to mongodb)
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