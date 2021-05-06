const fs = require("fs");
const { https } = require('follow-redirects');
const dwnOptions = require('./downloadOptions');

const pathToFile = './parse-file/';
const parseFile = pathToFile + process.env.filename;
let options = dwnOptions[process.env.downloadsource]

module.exports = { 
  GET() {
    const file = fs.createWriteStream(parseFile);
    if (!options) throw new Error ('Source not exist. Run "npm run showSourceNames" to get available source')
    https.get(options, function(res) {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.pipe(file);

    res.on('end', function() {
      console.log('Response to ' + options.host + ' ended');
    })

    res.on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  })},
  sources: Object.keys(dwnOptions),
}