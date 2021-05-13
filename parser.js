const XmlStream = require('xml-stream');
const fs = require("fs");
const pathToFile = './parse-file/';
const parseFile = pathToFile + process.env.filename;

let args = require('./parseObjects');

module.exports = {
  parseXml: function(col) {
    let itemList = []

    const xmlFileReadStream = fs.createReadStream(parseFile);
    const xmlFileWriteUrlStream = new XmlStream(xmlFileReadStream);

    const schema = process.env.parseschema

    if(args[schema].collectItems && args[schema].collectItems.length) {
      console.log("Collect items - " + args[schema].collectItems)
      args[schema].collectItems.forEach(element => {
        xmlFileWriteUrlStream.collect(element);
      })
    }

    xmlFileWriteUrlStream.on(`endElement: ${args[schema].endElement}`, parse)
    
    function parse(obj) { 
      try {
        (function runCallBacks() {
          let result
          for (let callBack of args[schema].callbacks) {
            typeof callBack === 'function'
              ? result = callBack(obj) : false
          }
          result && itemList.push(result)
        })()
      } catch(err) {console.log(err)}
    }

    xmlFileWriteUrlStream.on('end', async function() {
      console.log('Parsing Ended')
      console.log(itemList)
      await col.deleteMany({})
      col.insertMany(itemList, function(err, result) {
        if(err) { console.log(err); return };
        console.log(result)
      })
    })
  }
}