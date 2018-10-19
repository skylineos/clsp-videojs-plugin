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
  return results;
}

const server = http.createServer(async (req, res) => {

if (req.url == "/data") {
 res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const csvDirectory = path.join(__dirname, '..', 'soak');
    const results = await generateResults(csvDirectory);
    return res.end(JSON.stringify(results));
}

  res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const csvDirectory = path.join(__dirname, '..', 'soak');
    const send = `
                                    <!DOCTYPE html>
                     <html>

<header>
<link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css" rel="stylesheet" />

</header>

<body>
<div id="chart" class="c3" style="height: 100%;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script>
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



  $.ajax('/data', {
    success: (retData, status, req) => {
      var chart = c3.generate({
        chart: {
          size: {
            height: 480,
            width: 480,
          },
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
             type: 'timestamp',
             tick: {
               count: 5
             },
             format: (d) => {
               return new Date(d*1000).toLocaleTimeString(); 
             }
          }
        }
      });
    }, 
    error: (req, errType, excep) => {
    },
  })
/**
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
             type: 'category',
             tick: {
               count: 5
             }
        }
    }
});
$('.targ2').on('click', function() {
  $.ajax('/data', {
    complete: (req, res) => {
      console.log('this is the result of hitting the server');
      console.log(JSON.parse(req.responseText));
      console.log(res); 
    }
  })
});

$('.targ1').on('click', function() {
  setTimeout(function () {
    let columnData3 = ['data3']
      for (i=0;i<1000;i++) {
        columnData3.push(i+1);
      }
      let columnData2 = ['data2']
      for (i=0;i<1000;i = i+3) {
        columnData2.push(i+1);
      }
      let columnData1 = ['data1']
      for (i=0;i<1000;i = i+2) {
        columnData1.push(i+1);
      }
      let timeSeries = ['x']
      for (i=0;i<1000;i++) {
        timeSeries.push(i+1);
      }
      chart.load({
        columns: [
          timeSeries,
          columnData1,
          columnData2,
          columnData3,
        ]
    });
  }, 250);
});

$('.targ2').on('click', function() {
  setTimeout(function () {
    chart.load({
      columns: [
        ['data3', 800, 900, 1000, 1700, 1600, 1500]
      ]
    });
  }, 250);
});

$('.targ3').on('click', function() {
  setTimeout(function () {
    chart.load({
      columns: [
        ['data3', 40, 50, 45, 70, 60, 50]
      ]
    });
  }, 250);
});
for (i=0;i<10;i++) {
  if (i % 2 === 0) {
    $('.targ' + i).on('click', function() {
      console.log('evenssss');
    });
  }
  else {
    $('.targ' + i).on('click', function() {
      console.log('oddsssss');
    });
  }
};
*/


</script>

</body>
</html>
`
  return res.end(send);
});




server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
