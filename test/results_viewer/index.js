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

  console.log(results);

  return results;
}

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const csvDirectory = path.join(__dirname, '..', 'soak');

    const results = await generateResults(csvDirectory);

    const send = `
                                    <!DOCTYPE html>
                     <html>

<header>
<link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css" rel="stylesheet" />

</header>

<body>
<div id="chart" class="c3"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
<script>
var chart = c3.generate({
    data: {
        x: 'x',
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 340, 200, 500, 250, 350]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
});

setTimeout(function () {
    chart.load({
        columns: [
            ['data3', 400, 500, 450, 700, 600, 500]
        ]
    });
}, 1000);
</script>

</body>
</html>
`
   res.end(send);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
