var gulp = require('gulp');
var csscomb = require('postcss-csscomb');
var csswring = require ('csswring');
var postcss = require('gulp-postcss');
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
	.pipe(sass({ includePaths: paths.bootstrap }))
	.pipe(gulp.dest( paths.build ));
});

gulp.task('postcss', ['sass'], function() {
    var plugins = [
        uncss( { html: [ paths.html ] }),
        csswring( { removeAllComments: true } ),
        csscomb()
    ];
    return gulp.src( paths.build + '/main.css' )
        .pipe(postcss( plugins ))
        .pipe(gulp.dest( paths.dest ));
});

// Run all css tasks above in the following fixed sequence
gulp.task('default', ['sass', 'postcss']);
