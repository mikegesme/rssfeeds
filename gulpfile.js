var gulp = require('gulp');
var remoteSrc = require('gulp-remote-src');

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
}

gulp.task('events', function(){
    console.log('events...');
    var string = remoteSrc(['get?url=http://www.cannonfalls.org/event/feed/&callback=?'], {
      base: 'http://www.whateverorigin.org/'//,
      // requestOptions: {
      //   qs: 'url=' + encodeURIComponent('http://www.cannonfalls.org/event/feed/') + '&callback=?'
      // }
    });
});
  