const XmlStream = require('xml-stream');
const fs = require("fs");
const pathToFile = './parse-file/';
const parseFile = pathToFile + 'parse.xml';

let args = require('./parseObjects');

module.exports = {
  parseXml: function(col) {
    let itemList = []

    const xmlFileReadStream = fs.createReadStream(parseFile);
    const xmlFileWriteUrlStream = new XmlStream(xmlFileReadStream);

    if(args.UNOsancPerson.collectItems && args.UNOsancPerson.collectItems.length) {
      console.log("Collect items - " + args.UNOsancPerson.collectItems)
      args.UNOsancPerson.collectItems.forEach(element => {
        xmlFileWriteUrlStream.collect(element);
      })
    }

    xmlFileWriteUrlStream.on(`endElement: ${args.UNOsancPerson.endElement}`,
      parse
    )
    
    function parse(obj) { 
      try {
        (function runCallBacks() {
          let result
          for (let callBack of args.UNOsancPerson.callbacks) {
            typeof callBack === 'function'
              ? result = callBack(obj) : false
          }
          itemList.push(result)
        })()
      } catch(err) {console.log(err)}
    }

    xmlFileWriteUrlStream.on('end', function() {
      console.log('Parsing Ended')
      console.log(itemList)
      col.insertMany(itemList, function(err, result) {
        if(err) { console.log(err); return };
        console.log(result)
      })

      // fs.writeFile("./txt.json", JSON.stringify(itemList, null, 2), function(err) {
      //   if(err) {
      //       return console.log(err);
      //   }
      //   console.log("The file was saved!");
      // });
    })
  }
}