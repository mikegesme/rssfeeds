var regExp = /When.+?2018/;

var events = [];

$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('http://www.cannonfalls.org/event/feed/') + '&callback=?', function(data){
    xmlString = data.contents;
    xmlDoc = $.parseXML(xmlString);
    $xml = $( xmlDoc );
    items = $xml.find('item');
    console.log(items);
    $.each(items, function(i, item) {
        var self = this;
        var innerHTML = item.innerHTML;
        innerHTML = $(innerHTML).text();
        innerHTML = innerHTML.replace(/\s\s+/g, ' ');
        var matches = regExp.exec(innerHTML);
        if(matches[0]) {
            var date = new Date(matches[0]);
            var today = new Date();
            var twomonths = new Date();
            twomonths.setDate(today.getDate() + 60);
            // console.log(date);
            if (date >= today && date <= twomonths) {
                events.push(item.outerHTML);
            }
            else {
                $(self).remove();
            }
        }
    });
    // $(document).html(xmlDoc);
    // console.log(xmlDoc);
    // $(window).open('data:text/xml,' + encodeURIComponent( xmlDoc ) );
    var xmlText = new XMLSerializer().serializeToString(xmlDoc);
    var newdoc = window.document.open();
    newdoc.write(xmlText);
   newdoc.close();    // newDoc.write(xmlDoc);
    // newDoc.close();
});