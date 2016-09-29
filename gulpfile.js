// Node modules
var fs = require('fs'),
        vm = require('vm'),
        merge = require('deeply'),
        chalk = require('chalk'),
        es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'),
        rjs = require('gulp-requirejs-bundler'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        clean = require('gulp-clean'),
        replace = require('gulp-replace'),
        uglify = require('gulp-uglify'),
        htmlreplace = require('gulp-html-replace'),
        gulpCopy = require('gulp-copy');

// Copies the require configurator
gulp.task('quark-utils.require.conf', function () {
    return gulp.src('./src/quark-utils.require.conf.js')
        .pipe(gulp.dest('./dist/'));
});

// Concatenates together all required .js files, minifies them generating the normal lib and minified lib
gulp.task('js', function () {
    return gulp.src([
        './src/wrap.start',
        './src/binding-control.js',
        './src/blocking.js',
        './src/numeric.js',
        './src/utils.js',
        './src/wrap.end'
        ])
        .pipe(concat('quark-utils.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(rename('quark-utils.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});

// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task('default', ['clean', 'js', 'quark-utils.require.conf'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
