/*jshint node:true */
"use strict";

var execSync = require('child_process').execSync,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    csswring = require ('csswring'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sorting = require('postcss-sorting'),
    spawn = require('child_process').spawn,
    uncss = require('postcss-uncss');

var paths = {
    buildScript: 'build.sh',
    sassSource: '_sass/main.scss',
    bootstrap: 'node_modules/bootstrap-sass/assets/stylesheets/',
    html: '_site/**/*.html',
    dest: '_includes/'
};

// first build so uncss has html to work with
gulp.task('buildJekyll', function() {
    execSync(paths.buildScript, { stdio: 'inherit' } );
});

// Compile SASS, remove unused classes (uncss), minifiy (csswring) and comb code (csscomb)
gulp.task('css', ['buildJekyll'], function() {
    var plugins = [
        uncss({html: [ paths.html ]}),
        csswring({ removeAllComments: true }),
        sorting()
    ];
    return gulp.src( paths.sassSource )
        .pipe(sass({ includePaths: paths.bootstrap }))
        .pipe(postcss(plugins)).on('error', gutil.log)
        .pipe(gulp.dest( paths.dest ));
});

// Serve and watch but no initial build
gulp.task('serveJekyll', ['css'], function() {
    return spawn('bundle', ['exec', 'jekyll', 'serve', '--watch' ], { stdio: 'inherit' });
});

// build site, compile and optimize css, serve site, watch for changes
gulp.task('default', ['buildJekyll', 'css', 'serveJekyll' ], function() {
    gulp.watch(['_sass/**/*.scss'], function() {
        gulp.run('css');
    });
});
