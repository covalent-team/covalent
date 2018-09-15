'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

// Running gulp task 
gulp.task('default', function () {

    // Start browser process
    console.log("Start browser process");  
    electron.start();

    // Restart browser process
    gulp.watch('main.js', electron.restart);

    // Reload renderer process
    gulp.watch(['index.html', 'css/style.css'], electron.reload);
});