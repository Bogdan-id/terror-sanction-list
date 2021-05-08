'use strict'
require('dotenv').config()

const fs = require("fs");
const downloader = require("./downloader");
const connector = require('./connector');
const parseSchemas = require('./parseObjects');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});

function runParse() {
  if (process.env.SHOW_AVAILABLE_PARSE_SCHEMAS)  showAvailableSchemas()
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
    throw new Error ("Schema not exist. Run 'npm run showAvailableParseSchemas' to get available shemas")
  }
  fs.readdir('parse-file', (err, files) => {
    if (err) throw err
    if (!files?.includes(process.env.filename)) {
      throw new Error("File does not exit. Run 'npm run showAvailableFiles' to get available files")
    }
    connector.connect();
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
  });
}

function downloadFile () {
  if (!process.env.filename.includes('.xml')) {
    throw new Error ("Specify file name 'filename=<file name with extension> npm run ...'")
  }
  try { downloader.GET() } catch(err) {console.log(err)};
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