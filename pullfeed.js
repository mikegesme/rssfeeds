var request     = require('request');
var cheerio     = require('cheerio');
var fs          = require('fs');
var striptags   = require('striptags');

var regExp = /When.+?2018/;

request('http://www.cannonfalls.org/event/feed/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(html, { xmlMode: true });

    $('item').each(function(i, item) {
        innerHTML = $(item).text();
        innerHTML = innerHTML.replace(/\s\s+/g, ' ');
        innerHTML = innerHTML.replace('</strong>', '');
        var matches = regExp.exec(innerHTML);
        if(matches[0]) {
            var date = new Date(matches[0]);
            var today = new Date();
            var twomonths = new Date();
            twomonths.setDate(today.getDate() + 60);
            if (!(date >= today && date <= twomonths)) {
                $(item).remove();
            }
            else {
                var desc = striptags($("description", item).text());
                desc = desc.replace(/\s+/g,' ')
                $('description', item).replaceWith('<description>' + desc + '</description>');
                // $(item).append('<something>TESTING123Z</something>');
            }
        }
    });

    fs.writeFile("events.html", $.html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  }
});