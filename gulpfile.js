var gulp         = require('gulp'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    header       = require('gulp-header'),
    bump         = require('gulp-bump'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    gutil        = require('gulp-util'),
    preprocess   = require('gulp-preprocess');;

var fs = require('fs'),
    getPackageJson = function () {
      return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    };

gulp.task('bump', function() {
  var pkg = getPackageJson(),
      newVersion = gutil.env.bump || pkg.version;

  return gulp.src(['./package.json', './bower.json', './selectric.jquery.json'])
    .pipe(bump({
      version: newVersion
    }))
    .pipe(gulp.dest('./'));
});

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
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-min', ['bump'], function() {
  var pkg = getPackageJson();

  return gulp.src('src/jquery.selectric.js')
    .pipe(uglify())
    .pipe(header('/*! Selectric ϟ v<%= pkg.version %> (<%= new Date().toJSON().slice(0,10) %>) - git.io/tjl9sQ - Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos - Dual licensed: MIT/GPL */\n', { pkg: pkg }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', function() {
  return gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 7']
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('./dist'));
});

gulp.task('template', function() {
  return gulp.src('./template/*')
    .pipe(preprocess())
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['js', 'js-min']);
  gulp.watch('./src/*.scss', ['css']);
  gulp.watch('./template/*', ['template']);
});

gulp.task('default', ['bump', 'js', 'js-min', 'css', 'template']);