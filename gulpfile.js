/*jshint node:true */
"use strict";

var spawn = require('child_process').spawn,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    csswring = require ('csswring'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sorting = require('postcss-sorting'),
    uncss = require('postcss-uncss');

var paths = {
    sass_source: '_sass/main.scss',
    bootstrap: 'node_modules/bootstrap-sass/assets/stylesheets/',
    build: '_sass/build/',
    html: '_site/**/*.html',
    dest: '_includes/'
};

// Remove unused classes (uncss), minifiy (csswring) and comb code (csscomb)
gulp.task('css', function() {
    var plugins = [
        uncss({html: [ paths.html ]}),
        csswring({ removeAllComments: true }),
        sorting()
    ];
    return gulp.src( paths.sass_source )
        .pipe(sass({ includePaths: paths.bootstrap }))
        .pipe(postcss(plugins)).on('error', gutil.log)
        .pipe(gulp.dest( paths.dest ));
});

gulp.task('jekyll', function() {
    return spawn('bundle', ['exec', 'jekyll', 'serve', '--watch'], { stdio: 'inherit' });
});

// Run all css tasks above in the following fixed sequence
gulp.task('default', ['css', 'jekyll'], function() {
    gulp.watch(['_sass/**/*.scss'], function() {
        gulp.run('css');
    });
});
