var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    bump   = require('gulp-bump'),
    prefix = require('gulp-autoprefixer'),
    gutil  = require('gulp-util');

var fs = require('fs'),
    getPackageJson = function () {
      return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    };

gulp.task('bump', function(){
  var pkg = getPackageJson(),
      newVersion = gutil.env.bump || pkg.version;

  var stream = gulp.src(['./package.json', './bower.json', './selectric.jquery.json'])
    .pipe(bump({
      version: newVersion
    }))
    .pipe(gulp.dest('./'));

  return stream;
});

gulp.task('js', ['bump'], function(){
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
        ' * Selectric \u03DE v<%= pkg.version %> (<%= new Date().toJSON().slice(0,10) %>) - http://lcdsantos.github.io/jQuery-Selectric/',
        ' *',
        ' * Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos; Dual licensed: MIT\/GPL',
        ' *',
        ' */\n\n'
      ].join('\n');

  gulp.src('src/jquery.selectric.js')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-min', ['bump'], function(){
  var pkg = getPackageJson();

  gulp.src('src/jquery.selectric.js')
    .pipe(uglify())
    .pipe(header('/*! Selectric ϟ v<%= pkg.version %> (<%= new Date().toJSON().slice(0,10) %>) - git.io/tjl9sQ - Copyright (c) <%= new Date().getFullYear() %> Leonardo Santos - Dual licensed: MIT/GPL */\n', { pkg: pkg }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'));
});

var sass = function(options){
  var through = require('through2'),
      spawn   = require('win-spawn'),
      exec    = require('child_process').exec,
      path    = require('path');

  var options   = options || {},
      style     = options.style || 'expanded',
      sourcemap = options.sourcemap || 'none';

  function changeFile(file, newExt, newContent, context, callback){
    file.path = gutil.replaceExtension( file.path, newExt );

    file.contents = newContent;
    context.push(file);

    callback();
  }

  return through.obj(function(file, enc, cb) {
    var _this = this,
        args = ['--style', style, '--sourcemap=' + sourcemap, file.path];

    if (file.isBuffer()) {
      exec(['sass'].concat(args).join(' '), function(error, stdout, stderr){

        if ( stderr ){
          gutil.log('stderr: ' + stderr);
        }

        if (error !== null) {
          gutil.log('exec error: ' + error);
        }

        changeFile(file, '.css', new Buffer(stdout), _this, cb);
      });
    }

    if (file.isStream()) {
      var cmd = spawn('sass', args);

      cmd.stdout.on('data', function (data) {
        changeFile(file, '.css', data, _this, cb);
      });

      cmd.stderr.setEncoding('utf8');
      cmd.stderr.on('data', function (data) {
        gutil.log(data);
      });
    }
  });
};

module.exports = sass;

gulp.task('css', function(){
  gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'ie 7'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['bump', 'js', 'js-min', 'css']);
