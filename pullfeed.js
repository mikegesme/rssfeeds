var request     = require('request');
var cheerio     = require('cheerio');
var fs          = require('fs');
var striptags   = require('striptags');
var chrono      = require('chrono-node');
var moment      = require('moment');
var Entities  = require('html-entities').XmlEntities;

var entities = new Entities();

// City Calendar
request('https://www.cannonfallsmn.gov/calendar', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    nextmonth = chrono.parseDate('Next month');
    nextmonth = moment(nextmonth).format('YYYY-MM');
    request('https://www.cannonfallsmn.gov/calendar/month/' + nextmonth, function (error2, response2, html2) {
        if (!error2 && response2.statusCode == 200) {
            html += html2;
            $ = cheerio.load(html, { xmlMode: true });

            var output = fs.readFileSync('xmlhead.xml', 'utf8');
            // output += '<description>';

            $('.future .item .field-content a').each(function(i, item) {
                meeting = $(item).text();
                date = $(item).attr('title');
                odate = date.toLowerCase();
                date = chrono.parseDate(date);
                if (odate.includes('all day')) {
                    date = moment(date).format('M/D (ddd), ') + 'All Day';
                } 
                else {
                    date = moment(date).format('M/D (ddd), h:mm A');
                }
                output += date + ': ' + meeting + '\n';
            });

            output += '</description></item></channel></rss>';

            fs.writeFile("coc-cal.html", output, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("City Cal file was saved!");
            }); 
        }
        else { 
            console.log("ERROR - City Cal B")
        }
    });
  }
  else { 
    console.log("ERROR - City Cal A");
    console.log(error);
}
});

// Library
request('https://cannonfalls.lib.mn.us/feed/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(html, { xmlMode: true });
    
    today = chrono.parseDate('Today');
    twomonths = new Date();
    twomonths.setDate(twomonths.getDate() + 60);

    $('item').each(function(i, item) {
        title = $('title', item).text();
        if (date = chrono.strict.parseDate(title)) {
            if (!(today < date && date < twomonths)) {
                $(item).remove();
            }
        }
    });

    fs.writeFile("library.html", $.html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Library file was saved!");
    }); 
  }
  else {
      console.log('Library Error A');
      console.log(error);
  }
});

// City FB
/*
request('https://zapier.com/engine/rss/3145575/city/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(html, { xmlMode: true });
    
    now = chrono.parseDate('now');
    oneday = new Date();
    oneday.setDate(oneday.getDate() - 1);

    $('item').each(function(i, item) {
        pubDate = $('pubDate', item).text();
        if (date = chrono.strict.parseDate(pubDate)) {
            if (date < oneday) {
                $(item).remove();
            }
        }
    });

    fs.writeFile("city_fb.html", $.html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("City FB file was saved!");
    }); 
  }
});
*/

// CannonAB
let cabDOC = null;
let CABitems = [];
request('https://cannonab.com/events/feed/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(html, { xmlMode: true });
    
    today = chrono.parseDate('Today');
    twomonths = new Date();
    twomonths.setDate(twomonths.getDate() + 60);

    $('item').each(function(i, item) {
        pubDate = $('pubDate', item).text();
        if (date = chrono.strict.parseDate(pubDate)) {
            if ((today < date && date < twomonths)) {
                link = $('link', item).text();
                let desc = null;
                let newItem = {i, link, desc, item, pubDate};
                CABitems.push(newItem);
            }
        }
    });

    $('item').remove();
    cabDOC = $;
    addCABitems();

  }
});

function addCABitems() {

    let num = CABitems.length;
    let count = 0;

    CABitems.forEach(function(CABitem, i) {

           let link = CABitem.link;
    
           request(link, function (errorB, responseB, htmlB) {
            if (!errorB && responseB.statusCode == 200) {
                $B = cheerio.load(htmlB, { xmlMode: false });
                // var regExp = /clear:both\"\s\/>\s([\S\s]*?)<\/p>/;
                var regExpLoc = /Location<\/strong><br\/>([\S\s]*?)<\/a>/;
                var matchesLoc = regExpLoc.exec(htmlB);
                var location = entities.decode(striptags(matchesLoc[1])).replace(/(\r\n|\n|\r)/gm, "").trim();
                var regExp = /clear:both\"\s\/>\s([\S\s]*?)fl-post-content/;
                var matchesB = regExp.exec(htmlB);
                var desc = entities.decode(striptags(matchesB[1])).replace(/(\r\n|\n|\r)/gm, "").trim();
                eventDateInfo = chrono.parse(CABitem.pubDate);
                printDate = eventDateInfo[0].start.date();
                printDate = moment(printDate).format('dddd, MMMM Do, h:mm a');
                desc = printDate + ' - ' + location + '\n' + desc;
                CABitem.desc = desc;
                count++;
                if (count == num) {
                    writeCABfile();
                }
            }
            else {
                count++;
                if (count == num) {
                    writeCABfile();
                }
            }
        });

    });

}

function writeCABfile() {

    CABitems.forEach(function(CABitem, i) {
        cabDOC('channel').append(CABitem.item);
        cabDOC('description', CABitem.item).text(CABitem.desc);
    });

    fs.writeFile("cab.html", cabDOC.html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("CAB file was saved!");
    }); 

}

// // Cannon Falls TV FB
/*
request('https://zapier.com/engine/rss/3145575/cannonfallstv/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(html, { xmlMode: true });
    
    now = chrono.parseDate('now');
    oneday = new Date();
    oneday.setDate(oneday.getDate() - 1);

    $('item').each(function(i, item) {
        pubDate = $('pubDate', item).text();
        if (date = chrono.strict.parseDate(pubDate)) {
            if (date < oneday) {
                $(item).remove();
            }
        }
    });

    fs.writeFile("cftv_fb.html", $.html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("CF TV FB file was saved!");
    }); 
  }
});
*/

// request('http://www.hvlconference.org/g5-bin/client.cgi?cwellOnly=1&G5statusflag=view&school_id=7&G5button=13&G5genie=10&vw_schoolyear=1&vw_agl=5-1-18,&school_name_ical=Cannon%20Falls&RSSCalendar=1', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     $ = cheerio.load(html, { xmlMode: true });

    // var regExp = /When.+?2018/;
    // $('item').each(function(i, item) {
    //     innerHTML = $(item).text();
    //     innerHTML = innerHTML.replace(/\s\s+/g, ' ');
    //     innerHTML = innerHTML.replace('</strong>', '');
    //     var matches = regExp.exec(innerHTML);
    //     if(matches[0]) {
    //         var date = new Date(matches[0]);
    //         var today = new Date();
    //         var twomonths = new Date();
    //         twomonths.setDate(today.getDate() + 60);
    //         if (!(date >= today && date <= twomonths)) {
    //             $(item).remove();
    //         }
    //         else {
    //             var desc = striptags($("description", item).text());
    //             // desc = desc.replace(/\s+/g,' ')
    //             $('description', item).replaceWith('<description>' + desc + '</description>');
    //             // $(item).append('<something>TESTING123Z</something>');
    //         }
    //     }
    // });

    // fs.writeFile("baseball.html", $.html(), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log("Baseball file was saved!");
    // }); 
//   }
// });