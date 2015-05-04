'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var gulpNgConfig = require('gulp-ng-config');

var options = {
  src: 'src',
  dist: 'public',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: [/jquery/, /foundation\.js/, /foundation\.css/]
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
    gulp.src('src/app/server/config.json')
    .pipe(gulpNgConfig('turtleApp', {
      createModule: false,
      environment: "production"
    }))
    .pipe(gulp.dest('src/app/server/'));
    gulp.start('build');
});
