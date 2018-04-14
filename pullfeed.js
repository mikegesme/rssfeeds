var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');

request('http://www.cannonfalls.org/event/feed/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    // console.log(html);
    fs.writeFile("events.html", html, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  }
});