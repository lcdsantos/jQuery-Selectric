var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var getPackageJson = function() {
  var fs = require('fs');
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

var banner = [
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
  ' * Selectric \u03DF v<%= pkg.version %> (<%= new Date().toString().substr(4, 11) %>) - http://lcdsantos.github.io/jQuery-Selectric/',
  ' *',
  ' * Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos; MIT License',
  ' *',
  ' */\n\n'
].join('\n');

var bannerSmall = '/*! Selectric \u03DF v<%= pkg.version %> (<%= new Date().toJSON().slice(0,10) %>) - git.io/tjl9sQ - Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos - MIT License */\n';

var bannerCSS = [
  '/*======================================',
  '  Selectric v<%= pkg.version %>',
  '======================================*/\n\n'
].join('\n');


/**
 * Bump version
 */
gulp.task('bump', function() {
  var pkg = getPackageJson();
  var newVersion = $.util.env.bump || pkg.version;

  return gulp.src(['./package.json', './bower.json', './selectric.jquery.json'])
    .pipe($.bump({
      version: newVersion
    }))
    .pipe(gulp.dest('./'));
});


/**
 * JavaScript
 */
gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe($.eslint('.eslintrc'))
    .pipe($.eslint.format());
});

gulp.task('js', ['lint'], function() {
  var pkg = getPackageJson();

  return gulp.src(['src/jquery.selectric.js'])
    .pipe($.header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('js-min', function() {
  var pkg = getPackageJson();

  return gulp.src(['./src/jquery.selectric.js'])
    .pipe($.uglify({ output: { keep_quoted_props: true } }))
    .pipe($.header(bannerSmall, { pkg: pkg }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('js-plugins', ['lint'], function() {
  var pluginData = {
    date: new Date().toJSON().slice(0, 10),
    year: new Date().getFullYear()
  };

  return gulp.src(['*.js'], { cwd: './src/plugins/' })
    .pipe($.template(pluginData))
    .pipe(gulp.dest('./public/plugins/'))
    .pipe($.uglify({ preserveComments: 'license' }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/plugins/'))
    .pipe($.connect.reload());
});


/**
 * CSS
 */
gulp.task('css', function() {
  var pkg = getPackageJson();

  return gulp.src('./src/selectric.scss')
    .pipe($.sass({ outputStyle: 'expanded' }))
    .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 7'] }))
    .pipe($.header(bannerCSS, { pkg: pkg }))
    .pipe(gulp.dest('./public'))
    .pipe($.connect.reload());
});

gulp.task('themes-css', function() {
  return gulp.src('**/*.scss', { cwd: './src/themes/' })
    .pipe($.sass({ outputStyle: 'expanded' }))
    .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 7'] }))
    .pipe(gulp.dest('./public/themes/'));
});

gulp.task('plugins-css', function() {
  return gulp.src('**/*.scss', { cwd: './src/plugins/' })
    .pipe($.sass({ outputStyle: 'expanded' }))
    .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 7'] }))
    .pipe(gulp.dest('./public/plugins/'));
});


/**
 * Live preview
 */
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


/**
 * Watch
 */
gulp.task('watch', ['serve'], function() {
  gulp.watch(['*.js'],      { cwd: './src/' },         ['js', 'js-min']);
  gulp.watch(['*.js'],      { cwd: './src/plugins/' }, ['js-plugins']);
  gulp.watch(['*.scss'],    { cwd: './src/' },         ['css']);
  gulp.watch(['**/*.scss'], { cwd: './src/themes/' },  ['themes-css']);
  gulp.watch(['**/*.scss'], { cwd: './src/plugins/' }, ['plugins-css']);
  gulp.watch(['*.html'],    { cwd: './public/' },      ['html']);
});


/**
 * ZIP
 */
gulp.task('zip', function() {
  var pkg = getPackageJson();

  return gulp.src('./public/**/*')
    .pipe($.zip('selectric_v' + pkg.version + '.zip'))
    .pipe(gulp.dest('./'));
});


/**
 * GitHub Pages
 */
gulp.task('gh-pages', function() {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});


/**
 * Default tasks
 */
gulp.task('build',   ['bump', 'js', 'js-min', 'js-plugins', 'css', 'themes-css', 'plugins-css']);
gulp.task('default', ['build', 'watch']);
gulp.task('release', ['bump', 'build', 'zip']);
gulp.task('publish', ['gh-pages']);