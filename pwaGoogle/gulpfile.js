'use strict';

const browseSync = require('browser-sync').create();
const gulp        = require('gulp');

gulp.task('serv', () => {
    browseSync.init({
        server: ('./playground')
    })
})
