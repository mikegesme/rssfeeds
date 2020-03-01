var request     = require('request');
// var cheerio     = require('cheerio');
var fs          = require('fs');
// var striptags   = require('striptags');
// var chrono      = require('chrono-node');
var moment      = require('moment');
// var Entities  = require('html-entities').XmlEntities;

runs = [];

request('http://tighty.tv/cablecastapi/v1/scheduleitems?start=2020-01-18&end=2020-01-19', function (error, response, html) {
  if (!error && response.statusCode == 200) {
      json = JSON.parse(html);
      items = json.scheduleItems;
      items.forEach((item) => {
        request('http://tighty.tv/cablecastapi/v1/shows/' + item.show, function (error2, response2, html2) {
          if (!error2 && response2.statusCode == 200) {
            json2 = JSON.parse(html2);
            const run = {
              showID: item.show,
              dateTime: item.runDateTime,
              timestamp: moment(item.runDateTime).format('X'),
              time: moment(item.runDateTime).format('h:mm A'),
              cgTitle: json2.show.cgTitle
            };
            runs.push(run);
          }
          if (runs.length == items.length) {
            runs.sort((a, b) => a.timestamp - b.timestamp);
            writeFile();
          }
        });
      });
  }
});

// const addShow = () => {

//   request('http://tighty.tv/cablecastapi/v1/shows/' + items[count].show, function (error2, response2, html2) {
//     if (!error2 && response2.statusCode == 200) {
//       json2 = JSON.parse(html2);
//       run.push(json2.show.cgTitle);
//       runs.push(run);
//     }
//     if (runs.length == items.length) writeFile();
//   });

// }


const writeFile = () => {
  fs.writeFile("schedule.json", JSON.stringify(runs), function(err) {
    if(err) {
        return console.log(err);
    }
  }); 
}