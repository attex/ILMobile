// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var concat = require('gulp-concat');
var parcel = require('gulp-parcel')

gulp.task('sass', function () {
    return gulp.src('./src/scss/ilm.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css'));
});

gulp.task('watch-sass', function(){
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
});

gulp.task('nunjucks', function () {
    return gulp.src('src/templates/*.njk')
    .pipe(nunjucks.precompile())
    .pipe(concat('template.js'))
    .pipe(gulp.dest('www/lib'))
});

gulp.task('watch-nunjucks', function(){
    return gulp.watch('./src/templates/*.njk', gulp.series('nunjucks'))
});

gulp.task('bundlejs', function () {
    return gulp.src('src/bundle.js', {read:false})
    .pipe(parcel({cache:true, outDir:'www/lib', publicURL: './'}))
    .pipe(gulp.dest('www/lib'))
});

// gulp.task('watch-bundlejs', function(){
//     return gulp.watch('./www/scripts/tcpConnectionHandler.js', gulp.series('bundlejs'));
// })

gulp.task('build', gulp.series('sass', 'nunjucks', 'bundlejs'));
gulp.task('watch', gulp.parallel('watch-sass', 'watch-nunjucks'));

gulp.task('dev', gulp.series('build', 'watch'));


