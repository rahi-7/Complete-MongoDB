const { MongoClient } = require('mongodb')

let dbConnection 
let uri = "mongodb+srv://rabera131:Rahel7mom#@cluster0.lonhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

module.exports = { 
    connectToDb: (cb) => {
    MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()       
         })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
},
getDb: () => dbConnection
}