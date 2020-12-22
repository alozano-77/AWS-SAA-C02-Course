var gulp = require('gulp');
var markdown = require('gulp-markdown-it');

gulp.task('markdown', function() {
  return gulp
    .src('**/*.md')
    .pipe(markdown())
    .pipe(
      gulp.dest(function(f) {
        return f.base;
      })
    );
});

gulp.task('default', function() {
  return gulp.watch('**/*.md', gulp.series(['markdown']));
});