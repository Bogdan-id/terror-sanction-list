const fs = require("fs")
const { https } = require('follow-redirects')
const dwnOptions = require('./downloadOptions')

const pathToFile = './parse-file/';

module.exports = { 
  GET(fileName, autoOptions) {
    const options = dwnOptions[process.env.downloadsource] || dwnOptions[autoOptions]
    const parseFile = pathToFile + (process.env.filename || fileName)
    const file = fs.createWriteStream(parseFile)

    if (!options) {
      throw new Error ('Source does not exist. Run "npm run showSourceNames" to get available sources')
    }

    return new Promise((resolve, reject) => {
      const request = https.get(options, function(res) {
        console.log('statusCode:', res.statusCode)
        console.log('headers:', res.headers)

        res.pipe(file)
        
        res.on('end', function() {
          console.log('Response to ' + options.host + ' ended')
          resolve(file)
        })
        res.on('error', function(err) {
          console.log("Got error: " + err.message)
          reject(err)
        })
      })
      request.on('end', () => console.log('Request ended'))
    })
  },
  sources: Object.keys(dwnOptions),
}