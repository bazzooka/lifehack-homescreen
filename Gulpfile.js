var gulp = require('gulp');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('utils-merge');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

/* nicer browserify errors */
var gutil = require('gulp-util')
var chalk = require('chalk')

function map_error(err) {
  
  if (err.filename) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.filename.replace(__dirname + '/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.loc.line)
      + ' & '
      + 'Column '
      + chalk.magenta(err.loc.column || err.column)
      + ': '
      + chalk.green(err.message))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  //this.end()
}
/* */

gulp.task('watchify', function () {
  var args = merge(watchify.args, { debug: true })
  var bundler = watchify(browserify('./js/main.js', args)).transform(babelify, { /* opts */ })
  bundle_js(bundler)

  bundler.on('update', function () {
    bundle_js(bundler)
    gutil.log(chalk.green("Everything ok !"));
  })
})

function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'))
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
}

// Without watchify
gulp.task('browserify', function () {
  var bundler = browserify('./js/main.js', { debug: true }).transform(babelify, {/* options */ })

  return bundle_js(bundler)
})

// Without sourcemaps
gulp.task('browserify-production', function () {
  var bundler = browserify('./js/main.js').transform(babelify, {/* options */ })

  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})