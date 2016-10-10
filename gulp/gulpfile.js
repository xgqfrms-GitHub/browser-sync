var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserify = require('gulp-browserify'),
    uglify= require('gulp-uglify'),
    gulpif= require('gulp-if'),
    sass= require('gulp-sass'),
    browserSync = require('browser-sync'),
    connect= require('gulp-connect');
/*
CMD: 手动 传入参数 
set NODE_ENV=development
set NODE_ENV=production
https://www.youtube.com/watch?v=gRzCAyNrPV8
type  in cmd "set NODE_ENV=development(or production)"﻿
*/

var env = process.env.NODE_ENV;
// var env = process.env.NODE_ENV || 'production';
// var env = process.env.NODE_ENV || 'development';

var outputDir = 'builds';
    
gulp.task('jade',function(){
    return gulp.src('src/template/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
    // .pipe(gulp.dest('builds/development'));
});

gulp.task('js',function(){
    return gulp.src('src/ts/*.js')
    .pipe(browserify({ debug: env === 'development'}))
    .pipe(gulpif(env === 'production', uglify()))
    // .pipe(uglify())
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(connect.reload());
    // .pipe(gulp.dest('builds/development/js'));
});

gulp.task('sass',function(){
    var config = {};
    if (env === 'development') {
        config.sourceComments = 'map';
    } 
    if(env === 'production'){
        config.outputStyle = 'compressed';
    }
    return gulp.src('src/sass/*.scss')
    // .pipe(sass({ sourceComments: 'map'}))
    .pipe(sass(config))
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(connect.reload());
    // .pipe(gulp.dest('builds/development/css'));
});

gulp.task('connect',function(){
    connect.server({
        root: [outputDir],
        port: 8080,
        livereload: true,
        // open: { browser: 'Google Chrome'}
    });
});

//watcher of html and all files
gulp.task('browser-sync', function () {
   var files = [
      'builds/html/**/*.html',
      'builds/css/**/*.css',
      'builds/assets/images/**/*.jpg',
      'builds/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './builds'
      }
   });
});

gulp.task('watch',function(){
    gulp.watch('src/template/**/*.jade',['jade']);
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/sass/**/*.scss',['sass']);
    gulp.watch('src/html/*.html',['browser-sync']);
});

gulp.task('default',['js','sass','jade','browser-sync','watch','connect']);
// gulp