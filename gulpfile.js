// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('./src/scss/ilm.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css'));
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('./src/scss/*.scss', ['sass']);
})