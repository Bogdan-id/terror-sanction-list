'use strict'

const fs = require("fs");
const downloader = require("./downloader");

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});

try {
  downloader.GET
} catch(err) {console.log(err)}

