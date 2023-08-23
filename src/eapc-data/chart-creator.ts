import { Chart } from 'chart.js';
import fs from 'fs';
var JSDOM = require('jsdom').JSDOM;
import domtoimage from 'dom-to-image';
import { buffer } from 'stream/consumers';

const create_chart_image = (data_logs: data_log[], info: DataInfo) => {
    // Create instance of JSDOM.
    // var jsdom = new JSDOM('<body></body>', {runScripts: 'dangerously'});
    var jsdom = new JSDOM('<body><div><canvas id="myChart"></canvas></div></body>');
    const canvas = jsdom.window.document.getElementById('myChart');
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    // const buffer = canvas.toBuffer('image/png')
    //const buffer = Buffer.from(canvas.getDataURL().replace('data:image/png;base64,', ''), 'base64')
    //domtoimage.toPng(canvas).then(buffer => {
        //fs.writeFileSync('reports/image.png', buffer);
    //});
}

export {create_chart_image};