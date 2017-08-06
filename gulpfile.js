var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var run = require('gulp-run');
var sass = require('gulp-sass');
var uncss = require('postcss-uncss');

// Compiling the CSS from sass
gulp.task('sass', function () {
  return gulp.src('./_sass/main.scss')
	.pipe(sass())
	.pipe(gulp.dest('./_gulptmp/sass'));
});

// Sorting the CSS
gulp.task('comb', ['sass'], function() {
  return gulp.src('./_gulptmp/sass/main.css')
  .pipe(csscomb())
  .pipe(gulp.dest('./_gulptmp/comb'));
});

// Removing unused classes in CSS
gulp.task('uncss', ['comb'], function() {
    var plugins = [
        uncss({html: ['./_site/**/*.html']})
    ]
    return gulp.src('./_gulptmp/comb/main.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./_gulptmp/uncss'));
});

// Removing tabs and spaces in CSS
gulp.task('minify-css', ['uncss'], function() {
  return gulp.src('./_gulptmp/uncss/main.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('./_includes'));
});

// Run all css tasks above in the following fixed sequence
gulp.task('default', ['sass','comb', 'uncss', 'minify-css']);
