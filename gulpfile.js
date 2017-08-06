var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var run = require('gulp-run');
var sass = require('gulp-sass');
var uncss = require('postcss-uncss');

var paths = {
    source: './_sass/main.scss',
    bootstrap: './node_modules/bootstrap-sass/assets/stylesheets',
    build: './_sass/build',
    html: './_site/**/*.html',
    dest: './_includes'
};

// Compiling the CSS from sass
gulp.task('sass', function () {
  return gulp.src( paths.source )
	.pipe(sass({ includePaths: paths.bootstrap}))
	.pipe(gulp.dest( paths.build + '/sass' ));
});

// Sorting the CSS
gulp.task('comb', ['sass'], function() {
  return gulp.src(paths.build + '/sass/main.css')
  .pipe(csscomb())
  .pipe(gulp.dest( paths.build + '/comb' ));
});

// Removing unused classes in CSS
gulp.task('uncss', ['comb'], function() {
    var plugins = [
        uncss({
            html: [ paths.html ]
        }),
    ];
    return gulp.src( paths.build + '/comb/main.css' )
        .pipe(postcss( plugins ))
        .pipe(gulp.dest( paths.build + '/uncss' ));
});

// Removing tabs and spaces in CSS
gulp.task('minify-css', ['uncss'], function() {
    return gulp.src( paths.build + '/uncss/main.css' )
    .pipe(cleanCSS())
    .pipe(gulp.dest( paths.dest ));
});

// Run all css tasks above in the following fixed sequence
gulp.task('default', ['sass','comb', 'uncss', 'minify-css']);
