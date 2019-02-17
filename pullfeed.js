var request     = require('request');
var cheerio     = require('cheerio');
var fs          = require('fs');
var striptags   = require('striptags');
var chrono      = require('chrono-node');
var Entities  = require('html-entities').XmlEntities;

var entities = new Entities();

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
});

// City FB
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

// // CannonAB
// request('https://cannonab.com/events/feed/', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     $ = cheerio.load(html, { xmlMode: true });
    
//     today = chrono.parseDate('Today');
//     twomonths = new Date();
//     twomonths.setDate(twomonths.getDate() + 60);

//     $('item').each(function(i, item) {
//         link = $('link', item).text();
//         console.log(link);

//         RegExp.escape= function(s) {
//             return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
//         };

//         request(link, function (errorB, responseB, htmlB) {
//             if (!errorB && responseB.statusCode == 200) {
//                 $B = cheerio.load(htmlB, { xmlMode: false });
//                 // var regExp = new RegExp(RegExp.escape('/<br style=clear:both" />\s*(.*?)\s*<!-- .fl-post-content -->/'));
//                 // var regExp = /og:description\" content=\"([\s\S].*?)\/>/; //WORKS!!!
//                 // var regExp = /both(.*?)br/;
//                 // var regExp = /clear:both/; //WORKS
//                 // var regExp = /<!-- \.fl-post-content -->/; //WORKS
//                 // var regExp = /<br style=\"clear:both\" \/>\n(.*?)\n <\/br>\n	<\/div><!-- .fl-post-content -->/; //works on regexpal.com
//                 // var regExp = /<p>(.*?)<\/p>\s\s<\/br>/;
//                 // innerHTMLB = $B.text();
//                 // console.log(htmlB);
//                 // var matchesB = regExp.exec(htmlB);
//                 // var firstvariable = "clear:both";
//                 // var secondvariable = "fl-post-content";
//                 // var matchesB = htmlB.match(new RegExp(firstvariable + "(.*)" + secondvariable));
//                 var regExp = /clear:both\"\s\/>\s([\S\s]*?)<\/p>/;
//                 var matchesB = regExp.exec(htmlB);
//                 var desc = entities.decode(striptags(matchesB[1]));
//                 console.log($('description', item).text());
//                 // console.log(desc);
//                 // console.log(link);
//                 // console.log($B);
//                 // console.log("__________________________");
//                 // if (matchesB[0]) {
//                     // console.log(matchesB[0]);
//                 // }
//             }
//         });

//     });

//     fs.writeFile("cab.html", $.html(), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("CAB file was saved!");
//     }); 
//   }
// });

// // Cannon Falls TV FB
// request('https://zapier.com/engine/rss/3145575/cannonfallstv/', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     $ = cheerio.load(html, { xmlMode: true });
    
//     now = chrono.parseDate('now');
//     oneday = new Date();
//     oneday.setDate(oneday.getDate() - 1);

//     $('item').each(function(i, item) {
//         pubDate = $('pubDate', item).text();
//         if (date = chrono.strict.parseDate(pubDate)) {
//             if (date < oneday) {
//                 $(item).remove();
//             }
//         }
//     });

//     fs.writeFile("cftv_fb.html", $.html(), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("CF TV FB file was saved!");
//     }); 
//   }
// });

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