var request     = require('request');
var cheerio     = require('cheerio');
var fs          = require('fs');
var striptags   = require('striptags');
var chrono      = require('chrono-node');
var moment      = require('moment');
var Entities  = require('html-entities').XmlEntities;

var entities = new Entities();

request('http://tighty.tv/cablecastapi/v1/scheduleitems?start=2020-01-18&end=2020-01-19', function (error, response, html) {
  if (!error && response.statusCode == 200) {
      output = [];
      json = JSON.parse(html);
      // items = html.scheduleItems;
      for (item in json.scheduleItems[0]) {
          output.push(item);
      }
    fs.writeFile("schedule.json", JSON.stringify(output), function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
  }
});