const fs = require("fs");
const { https } = require('follow-redirects');
const connector = require('./connector');
const dwnOptions = require('./downloadOptions');

const pathToFile = './parse-file/';
const parseFile = pathToFile + 'parse.xml';
const file = fs.createWriteStream(parseFile);
let options = dwnOptions.UNOsanc //  USAsanc, UNOterror

module.exports = { 
  GET: https.get(options, function(res) {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.pipe(file);

    res.on('end', function() {
      console.log('Response to ' + options.host + ' ended');
      connector.connect();
    })

    res.on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  })
}