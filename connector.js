const MongoClient = require('mongodb').MongoClient;
const parser = require('./parser')

const dbName = process.env.DB_NAME;
const dbCollection = process.env.parseschema;
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const client = new MongoClient(url, options)

module.exports = {
  connect: (collection, filename) => {
    new Promise(resolve => {
      client.connect(async function(err) {
        if(err) {console.log(err); return}
        console.log('\r' + "Connected successfully to Mongo server")
  
        const db = client.db(dbName)
        collection = collection || dbCollection
        let col = db.collection(collection)
  
        await col.deleteMany({})
  
        if (filename) filename += '.xml'
  
        resolve(parser.parseXml(col, filename, collection))
      })
    })
  },
  client: client,
  dbName: process.env.DB_NAME,
}