'use strict'
require('dotenv').config()
const fs = require("fs")
const downloader = require("./downloader")
const parseSchemas = require('./parseObjects')
const { connect, client, dbName } = require('./connector')
const { parseXml } = require('./parser')

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});

require('node-schedule')
  .scheduleJob(process.env.CRON_TIMER, function() {
    console.log('autoparse')
    autoParse()
  })

function runParse() {
  if (process.env.CRON_PARSER) return
  if (process.env.SHOW_AVAILABLE_PARSE_SCHEMAS) showAvailableSchemas()
  if (process.env.parseschema && process.env.filename) parseData()
  if (process.env.REMOVE_FILE) removeFile()
  if (process.env.SHOW_EXTERNAL_SOURCES) showDownloadSources()
  if (process.env.SHOW_AVAILABLE_FILES) showFiles()
  if (process.env.downloadsource && process.env.filename) downloadFile()
  if (process.env.PARSER_HELP) consoleHelp()
}

runParse()

function parseData() {
  if (!Object.keys(parseSchemas).includes(process.env.parseschema)) {
    throw new Error ("Schema does not exist. Run 'npm run showAvailableParseSchemas' to get available schemas")
  }
  fs.readdir('parse-file', (err, files) => {
    if (err) throw err
    if (!files?.includes(process.env.filename)) {
      throw new Error("File does not exit. Run 'npm run showAvailableFiles' to get available files")
    }
    connect();
  })
}

function showAvailableSchemas () {
  console.log('Available schemas: ', Object.keys(parseSchemas))
}

function removeFile () {
  if (!process.env.filename || (process.env.filename && !process.env.filename.includes('.xml'))) {
    throw new Error ("specify the name of the file to be deleted 'filename=<file name with extension> npm run...'")
  }
  fs.unlink(`parse-file/${process.env.filename}`, err => {
    if (err) throw err
    console.log(`file ${process.env.filename} was deleted`)
  })
}

function showDownloadSources () {
  console.log('Sources: ', downloader.sources);
}

function showFiles () {
  fs.readdir('parse-file', (err, files) => {
    console.log('Files to parse: ', files)
  })
}

function autoParse () {
  client.connect(async function (err) {
    if (err) {
      console.log(err) 
      return
    }

    const db = client.db(dbName)
    const files = downloader.sources.map(source => {
      return downloadFile(source, source)
    })

    Promise.all(files).then(() => {
      console.log('Files downloaded')
      console.log('Parsing started')

      Object.keys(parseSchemas).map(async schema => {
        let col = db.collection(schema)
        await col.deleteMany({})
        parseXml(col, parseSchemas[schema].fileName + '.xml', schema)
      })
    })
  })
}

function downloadFile (fileName, option) {
  const notValidEnvName = process.env.filename && !process.env.filename.includes('.xml')
  if (notValidEnvName && typeof fileName !== 'string') {
    throw new Error ("Specify file name 'filename=<file name with extension> npm run ...'")
  }

  const fileNm = fileName.includes('.xml') ? fileName : fileName + '.xml'
  return downloader.GET(fileNm, option)
}

function consoleHelp () {
  const instruction = `
    To download file run:   'downloadsource=<source> filename=<arbitrary name with .xml> npm run start'
    To parse file run:      'parseschema=<scheema> filename=<filename> npm run start' 

    scripts:
      showAvailableSources      - print available sources
      showAvailableFiles        - print downloaded files
      showAvailableParseSchemas - print parsing schemes
      help                      - print helper info
  `
  console.log(instruction)
}