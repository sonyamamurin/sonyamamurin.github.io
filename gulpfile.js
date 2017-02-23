// From https://novelist.xyz/tech/performant-jekyll-site-with-gulp-cloudflare/
var gulp = require('gulp');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var uncss = require('gulp-uncss');
var cleanCSS = require('gulp-clean-css');
var critical = require('critical');

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
  return gulp.src('./_gulptmp/comb/main.css')
    .pipe(uncss({
    html: ['./_site/**/*.html'],
    ignore: [/fp/],
    timeout: 1000
  }))
  .pipe(gulp.dest('./_gulptmp/uncss'));
});

// Removing tabs and spaces in CSS
gulp.task('minify-css', ['uncss'], function() {
  return gulp.src('./_gulptmp/uncss/main.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('./_includes'));
});

/* // Extracting the critical path CSS
gulp.task('critical', ['minify-css'], function() {
  critical.generate({
    base: '_site/',
    src: 'index.html',  // Extract critical path CSS for index.html
    css: ['_gulptmp/css/style.css'],
    dest: './_includes/critical.css',
    minify: true,
    include: [/cc_/],
    ignore: ['@font-face']
  });
}); */


// Run all the tasks above in the following fixed sequence
gulp.task('css', ['sass','comb', 'uncss', 'minify-css'/*, 'critical'*/]);
