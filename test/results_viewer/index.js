#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const parse = require('csv-parse');

const hostname = '127.0.0.1';
const port = 3000;

async function generateResults (directory) {
  let csvFileNames = fs.readdirSync(directory).filter((fileName) => fileName.endsWith('.csv'));
  csvFileNames = [csvFileNames[0]];

  const results = await Promise.all(csvFileNames.map((fileName) => {
    return new Promise((resolve, reject) => {
      const timestamps = [];

      const parser = parse({
        cast: (value, context) => {
          if (context.count === 0) {
            return value;
          }

          if (context.index === 0) {
            const timestamp = moment(value, 'MM/DD/YYYY HH:mm:ss.SSS').unix();
            timestamps.push(timestamp);
            return timestamp;
          }

          const numericValue = Number.parseFloat(Number.parseFloat(value).toFixed(2));

          return (isNaN(numericValue))
            ? 0
            : numericValue;
        },
      }, (err, records) => {
        if (err) {
          return reject(err);
        }

        resolve({
          fileName,
          headers: records[0],
          timestamps: timestamps.sort(),
          records,
        });
      });

      fs.createReadStream(path.join(directory, fileName)).pipe(parser);
    });
  }));

  console.log(results);

  return results;
}

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const csvDirectory = path.join(__dirname, '..', 'soak');

  const results = await generateResults(csvDirectory);

  res.end(JSON.stringify(results));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
