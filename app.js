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
  if (process.env.downloadsource && !process.env.filename || (process.env.downloadsource && process.env.filename && !process.env.filename.includes('.xml'))) {
    throw new Error ("Specify file name 'filename=<file name with extension> npm run ...'")
  }
  if (process.env.SHOW_AVAILABLE_PARSE_SCHEMAS) {
    console.log('Available schemas: ', Object.keys(parseSchemas))
  }
  if (process.env.parseschema && process.env.filename) {
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
  if (process.env.REMOVE_FILE) {
    if (!process.env.filename || (process.env.filename && !process.env.filename.includes('.xml'))) {
      throw new Error ("specify the name of the file to be deleted 'filename=<file name with extension> npm run...'")
    }
    fs.unlink(`parse-file/${process.env.filename}`, err => {
      if (err) throw err
      console.log(`file ${process.env.filename} was deleted`)
    })
  }
  if (process.env.SHOW_EXTERNAL_SOURCES) {
    console.log('Sources: ', downloader.sources);
    return
  } 
  if (process.env.SHOW_AVAILABLE_FILES) {
    fs.readdir('parse-file', (err, files) => {
      console.log('Files to parse: ', files)
    });
    return
  }
  if (process.env.downloadsource && process.env.filename) {
    try { downloader.GET() } catch(err) {console.log(err)};
  }
}

runParse()
