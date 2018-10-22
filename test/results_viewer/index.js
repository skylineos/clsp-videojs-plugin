#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const parse = require('csv-parse');

const hostname = '127.0.0.1';
const port = 3000;

async function generateResults (directory, index) {
  let csvFileNames = fs.readdirSync(directory).filter((fileName) => fileName.endsWith('.csv'));
  if (csvFileNames[index] === null) {
    throw new Error('No one here by that name');
  }
  csvFileNames = [csvFileNames[index]];

  const results = await Promise.all(csvFileNames.map((fileName) => {
    return new Promise((resolve, reject) => {
      const timestamps = [];

      const parser = parse({
        cast: (value, context) => {
          if (context.count === 0) {
            return value;
          }

          if (context.index === 0) {
            const timestamp = moment(value, 'MM/DD/YYYY HH:mm:ss.SSS').valueOf();
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
  return results;
}

const server = http.createServer(async (req, res) => {

if (req.url.slice(0,6) == "/data/") {
    const index = req.url.slice(6)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const csvDirectory = path.join(__dirname, '..', 'soak');
    const results = await generateResults(csvDirectory, index);
    return res.end(JSON.stringify(results));
}

  res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const csvDirectory = path.join(__dirname, '..', 'soak');
    const send = `
                       <!DOCTYPE html>
                     <html style="height: 100%">

<header>
<link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css" rel="stylesheet" />

</header>

<body style="height: 100%">
<div id="chart" class="c3" style="height: 100%;, min-height: 100% !important"></div>

<select id="selector">
  <option onclick="switchData(0)" value="0" selected>0</option>
  <option onclick="switchData(1)" value="1">1</option>
  <option onclick="switchData(2)" value="2">2</option>
  <option onclick="switchData(3)" value="3">3</option>
  <option onclick="switchData(4)" value="4">4</option>
  <option onclick="switchData(5)" value="5">5</option>
</select>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script>

  function switchData(index) {

  }

  let dataObj

  const columnGenerator = (records, num) => {
    return records.map((record) => {
      if (typeof record[num] === "undefined") {
        return null
      }
      return record[num];
    })
  }

  const dataGenerator = (colGen, data) => {
    let dataMatrix = [];
    let records = data.records;
    for (i=0;i<records[0].length;i++) {
      let column = colGen(records, i);
      dataMatrix.push(column);
    }
    return dataMatrix;
  }



  $.ajax('/data/0', {
    success: (retData, status, req) => {
      var chart = c3.generate({
        padding: {
          bottom: 30,
        },
        data: {
          hide: true,
          x: 'time',
          columns: [
            ['time'].concat(retData[0].timestamps.slice(1)),
          ].concat(dataGenerator(columnGenerator, retData[0]))
        },
        axis: {
          x: {
             type: 'timeseries',
             tick: {
               count: 5,
               format: (d) => {
                 let day = new Date(d*1000);
                 return day.toDateString() + " " +
                 day.getHours() + " : " +
                 day.getMinutes() + " : " +
                 day.getSeconds();
               }
             },
          }
        }
      });
    }, 
    error: (req, errType, excep) => {
    },
  })

</script>

</body>
</html>
`
  return res.end(send);
});




server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
