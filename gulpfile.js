// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var concat = require('gulp-concat');
var parcel = require('gulp-parcel')

gulp.task('sass', function (done) {
    gulp.src('./src/scss/ilm.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css'));
    done();
});

gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series('sass'))
});

gulp.task('nunjucks', function (done) {
    gulp.src('src/templates/*.+(html|nunjucks)')
    .pipe(nunjucks.precompile())
    .pipe(concat('template.js'))
    .pipe(gulp.dest('www/lib'))
    done();
});

gulp.task('bundlejs', function (done) {
    gulp.src('src/bundle.js', {read:false})
    .pipe(parcel({cache:false,outDir:'.tmp'}))
    .pipe(gulp.dest('www/lib'))
    done();
});

gulp.task('build', gulp.parallel('sass', 'nunjucks', 'bundlejs'));

gulp.task('dev', gulp.series('build', 'watch'));


