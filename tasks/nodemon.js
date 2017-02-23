'use strict';
const Gulp = require('gulp');
const Nodemon = require('gulp-nodemon');

Gulp.task('nodemon', function() {

    const nodeArgs = [];
    const env = process.env.NODE_ENV;
    if (process.env.DEBUGGER) {
        nodeArgs.push('--inspect');
    }
    Nodemon({
            script: 'server.js',
            ext: 'hbs js',
            ignore: [
                'assets/',
                'node_modules/',
                '.build/',
                'test/'
            ],
            nodeArgs: nodeArgs
        })
        .on('restart', function(files) {
            console.log('change detected:', files);
        });
});
