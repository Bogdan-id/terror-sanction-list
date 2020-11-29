const MongoClient = require('mongodb').MongoClient;
const parser = require('./parser')

const dbName = 'PepUkraine';
const dbCollection = 'UNOsancPerson'; // USAsanc, UNOsancLegal, UNOsancTerror
const url = `mongodb+srv://dataPep:dvaodin1233@pepukraine.zbumz.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const client = new MongoClient(url, options);

module.exports = {
  connect: () => {
    client.connect(async function(err) {
      if(err) {console.log(err); return}
      console.log('\r' + "Connected successfully to Mongo server");

      const db = client.db(dbName);
      let col = db.collection(dbCollection);

      await col.deleteMany()

      parser.parseXml(col)
      console.log('Parsing started')
    })
  }
}