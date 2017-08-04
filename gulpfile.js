// From https://novelist.xyz/tech/performant-jekyll-site-with-gulp-cloudflare/
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
//var critical = require('critical');
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

/*// Extracting the critical path CSS
gulp.task('critical', ['minify-css'], function() {
  critical.generate({
    base: './_site',
    src: '. /index.html',  // Extract critical path CSS for index.html
    css: ['assets/main.css'],
    dest: './_includes/critical.css',
    minify: true,
  });
});*/

gulp.task('imagemin', function() {
    return gulp.src('assets/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
    .pipe(gulp.dest('assets/img/'))
});

// Run all css tasks above in the following fixed sequence
gulp.task('build-css', ['sass','comb', 'uncss', 'minify-css']);

gulp.task('default', ['build-css', 'imagemin']);
