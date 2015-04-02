var gulp = require('gulp'),
    $    = require('gulp-load-plugins')(),
    fs   = require('fs');

var getPackageJson = function() {
      return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    };

/*======================================
  Bump version
======================================*/
gulp.task('bump', function() {
  var pkg = getPackageJson(),
      newVersion = $.util.env.bump || pkg.version;

  return gulp.src(['./package.json', './bower.json', './selectric.jquery.json'])
    .pipe($.bump({
      version: newVersion
    }))
    .pipe(gulp.dest('./'));
});

/*======================================
  Javascript
======================================*/
gulp.task('js', ['bump'], function() {
  var pkg = getPackageJson(),
      banner = [
        '/*!',
        ' *         ,/',
        ' *       ,\'/',
        ' *     ,\' /',
        ' *   ,\'  /_____,',
        ' * .\'____    ,\'',
        ' *      /  ,\'',
        ' *     / ,\'',
        ' *    /,\'',
        ' *   /\'',
        ' *',
        ' * Selectric \u03DE v<%= pkg.version %> (<%= new Date().toString().substr(4, 11) %>) - http://lcdsantos.github.io/jQuery-Selectric/',
        ' *',
        ' * Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos; Dual licensed: MIT\/GPL',
        ' *',
        ' */\n\n'
      ].join('\n');

  return gulp.src('src/jquery.selectric.js')
    .pipe($.header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('js-min', ['bump'], function() {
  var pkg = getPackageJson();

  return gulp.src('src/jquery.selectric.js')
    .pipe($.uglify())
    .pipe($.header('/*! Selectric ϟ v<%= pkg.version %> (<%= new Date().toJSON().slice(0,10) %>) - git.io/tjl9sQ - Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos - Dual licensed: MIT/GPL */\n', { pkg: pkg }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

/*======================================
  CSS
======================================*/
gulp.task('css', function() {
  var pkg = getPackageJson();

  return gulp.src('./src/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 7']
    }))
    .pipe($.csscomb())
    .pipe($.header('/*======================================\n  Selectric v<%= pkg.version %>\n======================================*/\n', { pkg: pkg }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

/*======================================
  Live preview
======================================*/
gulp.task('serve', function() {
  $.connect.server({
    root: './public',
    livereload: true
  });
});

gulp.task('html', function() {
  return gulp.src('./public/*.html')
    .pipe($.connect.reload());
});

/*======================================
  Watch
======================================*/
gulp.task('watch', ['serve'], function() {
  gulp.watch(['./src/*.js'], ['js', 'js-min']);
  gulp.watch(['./src/*.scss'], ['css']);
  gulp.watch(['./public/*.html'], ['html']);
});

/*======================================
  ZIP
======================================*/
gulp.task('zip', function() {
  var pkg = getPackageJson();

  return gulp.src('./public/*')
    .pipe($.zip('selectric_v' + pkg.version + '.zip'))
    .pipe(gulp.dest('./'));
});

/*======================================
  GitHub Pages
======================================*/
gulp.task('gh-pages', function() {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

/*======================================
  Default tasks
======================================*/
gulp.task('build', ['js', 'js-min', 'css']);
gulp.task('default', ['build', 'watch']);
gulp.task('release', ['bump', 'build', 'zip']);
gulp.task('publish', ['gh-pages']);